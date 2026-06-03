pipeline{
    agent any
    environment{
        FRONTEND_IMAGE = "saurabhkumar005/syncmate-frontend"
        BACKEND_IMAGE = "saurabhkumar005/syncmate-backend"
    }
    stages{
        stage('Clone Repository'){
            steps{
                git branch: 'dev',
                url: 'https://github.com/saurabhkumar005/SyncMate.git'
            }
        }
        stage('List Project Files'){
            steps{sh 'ls'}
        }
        stage('Build Frontend Docker Image'){
            steps{
                sh 'docker build -t $FRONTEND_IMAGE:v1 ./Frontend'
            }
        }
        stage('Build Backend Docker Image'){
            steps{
                sh 'docker build -t $BACKEND_IMAGE:v1 ./Backend'
            }
        }
        stage('show Docker Images'){
            steps{
                sh 'docker images'
            }
        }
    }
    post{
        success{
            echo 'Pipeline executed successfully'
        }
        failure{
            echo 'pipeline failed'
        }
    }
}