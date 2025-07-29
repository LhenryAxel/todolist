pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "ghcr.io/lhenryaxel/todolist"
    DOCKER_TAG = "v1.0.${BUILD_NUMBER}"
    GITHUB_CREDENTIALS = 'ghcr-token'
  }

  stages {

    stage('Cloner le dépôt') {
      steps {
        git credentialsId: "${GITHUB_CREDENTIALS}", url: 'https://github.com/LhenryAxel/todolist.git', branch: 'master'
      }
    }

    stage('Installer les dépendances') {
      steps {
        script {
          docker.image('node:20').inside {
            dir('frontend') {
              sh 'npm ci'
            }
            dir('api') {
              sh 'npm ci'
            }
          }
        }
      }
    }

    stage('Lancer les tests') {
      steps {
        script {
          docker.image('node:20').inside {
            dir('frontend') {
              sh 'npm run test'
            }
            dir('api') {
              sh 'npm test || echo "⚠ Aucun vrai test API encore"'
            }
          }
        }
      }
    }

    stage('Construire l’image Docker') {
      steps {
        script {
          docker.withRegistry('https://ghcr.io', "${GITHUB_CREDENTIALS}") {
            def image = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", '.')
            image.push()
            image.push('latest')
          }
        }
      }
    }

    stage('Tag Git du dépôt') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'ghcr-token', passwordVariable: 'GITHUB_TOKEN', usernameVariable: 'GITHUB_USER')]) {
          sh """
            git config user.name "jenkins"
            git config user.email "jenkins@ci.local"
            git tag ${DOCKER_TAG}
            git push https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/LhenryAxel/todolist.git --tags
          """
        }
      }
    }
  }

  triggers {
    pollSCM('H/5 * * * *') 
  }

  post {
    failure {
      echo '❌ Le pipeline a échoué.'
    }
    success {
      echo "✅ Pipeline terminé avec succès - tag ${DOCKER_TAG} publié."
    }
  }
}
