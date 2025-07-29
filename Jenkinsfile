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
        git credentialsId: "${GITHUB_CREDENTIALS}", url: 'https://github.com/LhenryAxel/todolist.git', branch: 'main'
      }
    }

    stage('Installer les dépendances') {
      steps {
        dir('frontend') {
          sh 'npm ci'
        }
        dir('api') {
          sh 'npm ci'
        }
      }
    }

    stage('Lancer les tests') {
      steps {
        dir('frontend') {
          sh 'npm run test'
        }
        dir('api') {
          sh 'npm test || echo "⚠ Aucun vrai test API encore"'
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
        sh """
          git config user.name "jenkins"
          git config user.email "jenkins@ci.local"
          git tag ${DOCKER_TAG}
          git push https://lhenryaxel:${env.GITHUB_TOKEN}@github.com/LhenryAxel/todolist.git --tags
        """
      }
    }
  }

  triggers {
    pollSCM('H/5 * * * *') // déclenchement auto toutes les 5 minutes si commit
  }

  post {
    failure {
      echo 'Le pipeline a échoué.'
    }
    success {
      echo "Pipeline terminé avec succès - tag ${DOCKER_TAG} publié."
    }
  }
}
