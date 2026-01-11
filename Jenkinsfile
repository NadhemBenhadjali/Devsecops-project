pipeline {
  agent any

  options {
    ansiColor('xterm')
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  parameters {
    choice(name: 'DEPLOY_ENV', choices: ['none', 'staging', 'prod'], description: 'Deploy after a successful build')
    booleanParam(name: 'RUN_SEMGREP', defaultValue: true, description: 'Run Semgrep SAST')
    booleanParam(name: 'RUN_GITLEAKS', defaultValue: true, description: 'Run Gitleaks secrets scan')
  }

  environment {
    NODE_VERSION = '20'
    REGISTRY = "${env.REGISTRY ?: 'ghcr.io'}"
    IMAGE_NAMESPACE = "${env.IMAGE_NAMESPACE ?: 'nadhembenhadjali'}"  
    TRIVY_CACHE_DIR = "${WORKSPACE}/.trivy-cache"
    DOCKER_HOST = "unix:///var/run/docker.sock"
    K8S_NAMESPACE = 'consumesafe'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD > .git/shortsha'
      }
    }

    stage('Install, Lint, Build') {
      parallel {
        stage('Backend: npm ci + lint') {
          agent {
            docker { image 'node:20-bookworm-slim'; args '-u root:root' }
          }
          steps {
            dir('backend') {
              sh 'npm ci --verbose'
              sh 'npm run lint'
            }
          }
        }

        stage('Frontend: npm ci + lint + build') {
          agent {
            docker { image 'node:20-bookworm-slim'; args '-u root:root' }
          }
          steps {
            dir('frontend') {
              sh 'npm ci'
              sh 'npm run lint'
              sh 'npm run build'
            }
          }
          post {
            success {
              archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true
            }
          }
        }
      }
    }

    stage('Dependency Vulnerability Scan') {
      agent {
        docker { image 'node:20-bookworm-slim'; args '-u root:root' }
      }
      steps {
        sh 'bash ci/npm_audit.sh'
      }
    }

    stage('Secrets Scan (Gitleaks)') {
      when { expression { return params.RUN_GITLEAKS } }
      agent {
        docker { image 'zricethezav/gitleaks:v8.19.2'; args '--entrypoint=""' }
      }
      steps {
        sh 'bash ci/gitleaks.sh'
      }
    }

    stage('SAST (Semgrep)') {
      when { expression { return params.RUN_SEMGREP } }
      agent {
        docker { image 'returntocorp/semgrep:1.82.0'; args '--entrypoint=""' }
      }
      steps {
        sh 'bash ci/semgrep.sh'
      }
      post {
        always {
          archiveArtifacts artifacts: 'frontend/dist/**, reports/**', allowEmptyArchive: true
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'bash ci/docker_build.sh'
        sh 'cat .ci/image_tags.env'
      }
    }

    stage('Container Scan (Trivy)') {
      agent {
        docker {
          image 'aquasec/trivy:0.50.2'
          args '--entrypoint="" -u 0:0 -v /var/run/docker.sock:/var/run/docker.sock'
          reuseNode true

        }
      }
      steps {
        sh 'mkdir -p "$TRIVY_CACHE_DIR" reports'
        sh 'command -v docker >/dev/null 2>&1 && docker version || true'
        sh 'trivy --version'
        sh 'sh ci/trivy_scan.sh'
      }
    }


    stage('Push Images') {
      when { expression { return env.IMAGE_NAMESPACE != 'replace-me' } }
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-nadhem', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
          sh 'bash ci/docker_push.sh'
        }
      }
    }

    stage('Deploy to Kubernetes') {
      when {
        anyOf {
          expression { return params.DEPLOY_ENV == 'staging' }
          expression { return params.DEPLOY_ENV == 'prod' }
        }
      }
      steps {
        script {
          def kubeCred = params.DEPLOY_ENV == 'prod' ? 'kubeconfig-file' : 'kubeconfig-file'
          withCredentials([file(credentialsId: kubeCred, variable: 'KUBECONFIG_FILE')]) {
            sh 'bash ci/k8s_deploy.sh'
          }
        }
      }
    }

    stage('Smoke Test') {
      when {
        anyOf {
          expression { return params.DEPLOY_ENV == 'staging' }
          expression { return params.DEPLOY_ENV == 'prod' }
        }
      }
      agent {
        docker { image 'curlimages/curl:8.6.0'; args '--entrypoint=""' }
      }
      steps {
        sh 'sh ci/smoke_test.sh'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
      junit testResults: 'reports/junit-*.xml', allowEmptyResults: true
    }
  }
}
