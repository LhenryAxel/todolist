pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('ghcr-token')
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Cloning repository..."
                checkout scm
                echo "Code checked out"
            }
        }

        stage('Install dependencies - Frontend') {
            steps {
                echo "Installing frontend dependencies in temporary container"
                sh '''
                    docker create --name tmp-frontend node:20 sh -c'
                        cd /app &&
                        npm install
                    '
                    docker cp ./frontend/. tmp-frontend:/app
                    docker start -a tmp-frontend
                    docker rm tmp-frontend
                    echo "Dependencies installed successfully"
                '''
            }
        }

        stage('Run tests - Frontend') {
            steps {
                echo "Running frontend tests in isolated container"
                sh '''
                    docker create --name test-frontend node:20 sh -c'
                        cd /app &&
                        npm install &&
                        npm test
                    '
                    docker cp ./frontend/. test-frontend:/app
                    docker start -a test-frontend
                    docker rm test-frontend
                    echo "Tests completed successfully"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building frontend Docker image"
                sh '''
                    docker build -t lhenryaxel/todolist-frontend:latest ./frontend
                    echo "Docker image built"
                '''
            }
        }

        stage('Push to GitHub Packages') {
            steps {
                echo "Pushing Docker image to GitHub Packages"
                script {
                    def versionTag = "v1.0.${env.BUILD_NUMBER}"
                    sh '''
                        echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login ghcr.io -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin

                        docker tag lhenryaxel/todolist-frontend:latest ghcr.io/lhenryaxel/todolist-frontend:latest
                        docker tag lhenryaxel/todolist-frontend:latest ghcr.io/lhenryaxel/todolist-frontend:${versionTag}

                        docker push ghcr.io/lhenryaxel/todolist-frontend:latest
                        docker push ghcr.io/lhenryaxel/todolist-frontend:${versionTag}
                    '''
                }
            }

        stage('Tag Git repo') {
            steps {
                echo "Tagging GitHub repository with version number"
                withCredentials([usernamePassword(credentialsId: 'ghcr-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh '''
                        git config user.email "ci@todo.com"
                        git config user.name "CI Bot"
                        VERSION_TAG="v1.0.${BUILD_NUMBER}"
                        git tag -a $VERSION_TAG -m "Build $BUILD_NUMBER"
                        git push https://${GIT_USER}:${GIT_PASS}@github.com/LhenryAxel/todolist.git --tags
                        echo "Repository tagged with $VERSION_TAG"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace"
            cleanWs()
        }
        failure {
            echo "Build failed"
        }
    }
}
