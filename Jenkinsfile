pipeline {

    agent any

    environment {
        FRONTEND_IMAGE = "saurabhkumar005/syncmate-frontend"
        BACKEND_IMAGE = "saurabhkumar005/syncmate-backend"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'dev',
                url: 'https://github.com/saurabhkumar005/SyncMate.git'
            }
        }

        stage('List Project Files') {
            steps {
                sh 'ls'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t $FRONTEND_IMAGE:latest ./Frontend'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE:latest ./Backend'
            }
        }

        stage('DockerHub Login') {
            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'

                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh 'docker push $FRONTEND_IMAGE:latest'
            }
        }

        stage('Push Backend Image') {
            steps {
                sh 'docker push $BACKEND_IMAGE:latest'
            }
        }

        stage('Show Docker Images') {
            steps {
                sh 'docker images'
            }
        }
    }

    post {

        success {
            echo 'CI/CD Pipeline Executed Successfully'
        }

        failure {
            echo 'Pipeline Failed'
        }

        always {
            echo 'Pipeline Finished'
        }
    }
}