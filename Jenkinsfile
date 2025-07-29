pipeline {
  agent any

  environment {
    VERSION = "v1.${BUILD_NUMBER}"
    IMAGE_API = "ghcr.io/lhenryaxel/todolist-api:${VERSION}"
    IMAGE_FRONT = "ghcr.io/lhenryaxel/todolist-front:${VERSION}"
  }

  stages {
    stage('Checkout') {
      steps {
        git credentialsId: 'ghcr-token', url: 'https://github.com/LhenryAxel/todolist.git'
      }
    }

    stage('Install dependencies - API') {
      steps {
        dir('api') {
          sh 'docker run --rm -v $PWD:/app -w /app node:20 npm install'
        }
      }
    }

    stage('Install dependencies - Frontend') {
      steps {
        dir('frontend') {
          sh 'docker run --rm -v $PWD:/app -w /app node:20 npm install'
        }
      }
    }

    stage('Check API dir') {
      steps {
        dir('api') {
          sh 'ls -la'
          sh 'cat package.json || echo "❌ package.json not found"'
        }
      }
    }


    stage('Run tests - API') {
      steps {
        dir('api') {
          sh 'docker run --rm -v $PWD:/app -w /app node:20 npm test'
        }
      }
    }

    stage('Run tests - Frontend') {
      steps {
        dir('frontend') {
          sh 'docker run --rm -v $PWD:/app -w /app node:20 npm run test'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t $IMAGE_API ./api'
        sh 'docker build -t $IMAGE_FRONT ./frontend'
      }
    }

    stage('Tag Git') {
      steps {
        sh "git tag $VERSION && git push origin $VERSION"
      }
    }

    stage('Push to GitHub Packages') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'ghcr-token', usernameVariable: 'USERNAME', passwordVariable: 'TOKEN')]) {
          sh """
            echo "$TOKEN" | docker login ghcr.io -u $USERNAME --password-stdin
            docker push $IMAGE_API
            docker push $IMAGE_FRONT
          """
        }
      }
    }
  }
}
