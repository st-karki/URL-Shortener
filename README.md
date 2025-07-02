# 📌 URL-Shortener

URL Shortener – Microservices-Based Architecture

## 📁 Directory Structure

```
URL-Shortener/
├── shorten-service/
│   ├── src/
│   │   └── index.js
│   ├── Dockerfile
|   ├── .dockerignore
│   ├── package.json
│   └── README.md
│
├── redirect-service/
│   ├── src/
│   │   └── index.js
│   ├── Dockerfile
|   ├── .dockerignore
│   ├── package.json
│   └── README.md
│
├── k8s/
│   ├── shorten-deployment.yaml
│   ├── redirect-deployment.yaml
│   ├── redis-deployment.yaml     # Optional
│   ├── ingress.yaml
│   └── namespace.yaml
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── docker-compose.yml
├── .gitignore
├── README.md
└── LICENSE
```
