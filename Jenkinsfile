pipeline {
  agent any
  stages {
    stage('Checkout code') {
      steps {
        git(url: 'https://github.com/Balaji6245/ExpenseTracker', branch: 'main')
      }
    }

    stage('Build') {
      steps {
        sh 'docker build -f DockerFile .'
      }
    }

  }
}