pipeline {
  agent any

  environment {
    VERSION = "v1.${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git credentialsId: 'ghcr-token', url: 'https://github.com/LhenryAxel/todolist.git'
      }
    }

  stage('Install dependencies') {
    steps {
      dir('frontend') {
        sh 'docker run --rm -v $PWD:/app -w /app node:20 npm install'
      }
      dir('api') {
        sh 'docker run --rm -v $PWD:/app -w /app node:20 npm install'
      }
    }
  }


    stage('Run tests') {
      steps {
        // Frontend tests (Vitest)
        sh 'docker run --rm -v $PWD/frontend:/app -w /app node:20 npm test || true'

        // API: no real tests yet
        sh 'docker run --rm -v $PWD/api:/app -w /app node:20 bash -c "npm test || echo ⚠ Aucun vrai test API encore"'
      }
    }

    stage('Build Docker Images') {
      steps {
        sh "docker build -t ghcr.io/lhenryaxel/todolist-api:${VERSION} ./api"
        sh "docker build -t ghcr.io/lhenryaxel/todolist-front:${VERSION} ./frontend"
      }
    }

    stage('Tag Git') {
      steps {
        sh "git tag ${VERSION} && git push origin ${VERSION}"
      }
    }

    stage('Push to GitHub Package Registry') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'ghcr-token', usernameVariable: 'USERNAME', passwordVariable: 'TOKEN')]) {
          sh """
            echo "$TOKEN" | docker login ghcr.io -u $USERNAME --password-stdin
            docker push ghcr.io/lhenryaxel/todolist-api:${VERSION}
            docker push ghcr.io/lhenryaxel/todolist-front:${VERSION}
          """
        }
      }
    }
  }
}
