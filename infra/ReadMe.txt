mkdir ticketing
cd ticketing
mkdir auth
cd auth
npm install typescript ts-node-dev express @types/express
tsc --init (adds tsconfig.json)
Create folder src -> add index.ts -> added initial code
In package.json: scripts -> start: ts-node-dev src/index.ts
Added Dockerfile with default script and added .dockerignore to ignore node_modules
Created docker image using: docker build -t harshbodgal/auth .
Created infra/k8s/auth-depl.yaml

First set apiVersion, kind as Deployment and name under metadata as auth-depl.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-depl

write out spec: 
How many copies you want to run?

spec:
  replicas: 1

This selector will tell the deployment how to find the pods that needs to be created.
This template will tell the deployment how to create each individual pods.
The app name will be same to be matched.
Spec will tell the pod how to behave.
Containers will designate all the containers that will be running inside this pod. Name inside container is just important for logging purposes.
  selector:
    matchLabels:
      app: auth  
  template:
    metadata:
      labels:
        app: auth
    spec:
      containers:
        - name: auth
          image: harshbodgal/auth
---
apiVersion: v1
kind: Service
metadata:
  name: auth-srv
spec:
  selector:
    app: auth
  ports:
    - name: auth
      protocol: TCP
      port: 3000
      targetPort: 3000


Added skaffold config file


apiVersion: skaffold/v2alpha3
kind: Config

list all config files we want to load in our cluster

deploy:
  kubectl:
    manifests:
      - ./infra/k8/*

we dont want deployment to push image to  
build:
  local:
    push: false
  artifacts:
    - image: harshbodgal/auth
      context: auth
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: 'src/**/*.ts'
            dest: .
. means : take files and throw it same place inside container


Go to root and run skaffold dev
It will start deployment process and watch for future changes
If not, 

update the start script: ts-node-dev --poll src/index.ts



Ingress Nginx

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-service
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
    - host: ticketing.dev
      http:
        paths:
          - path: /api/users/?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: auth-srv
                port:
                  number: 3000


------------------------------------------------------------------------------------


Created Free Tier account on google cloud
Create new project ticketing-dev.
Created Cluster (ticketing-dev-cluster) with default 3 nodes, default OS setting, machine type N1, shared core, g1-small.
Now we need our local machine to connect to cluster that is on google cloud. Kubernetes on local machine gets information from context file about which cluster to connect. (right click on Docker icon, you will see kubernetes context. )

We need to add new context to connect to GCP kubernetes cluster. 
cloud.google.com/sdk/docs/quickstarts can help write new context file.

To login into Google Cloud SDK: open terminal and type: gcloud auth login

install the plugin: gcloud components install gke-gcloud-auth-plugin

use this command to get credentials: gcloud container clusters get-credentials ticketing-dev-cluster

This is how we tell kubectl that we want to connect to kubernetes cluster on google cloud.



some more steps:

Enable google cloud build on GCP. Search for Cloud Build API and enable it.

Update Skaffold.yaml with:
# local:
#   push: false
googleCloudBuild:
    projectId: buoyant-genre-431104-d3
  artifacts:
    - image: us.gcr.io/buoyant-genre-431104-d3/auth


Now setup nginx on google cloud cluster.

gcloud container clusters get-credentials ticketing-dev-cluster

deploy ingress nginx on GCP
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/cloud/deploy.yaml

Go to network on GCP -> Find service (load balancer) -> copy ip address ->
Update host file to forward request for ticketing.dev to the loadbalancer ip address.

34.127.13.19 ticketing.dev

Now as we have updated skaffold and auth-depl.yaml with gcp information, run the file:

skaffold dev

https://ticketing.dev/api/users/currentuser

You will now be able to see everything running.

So we 
created cluster, 
installed ingress nginx,
updated host file with LB's IP address.





Working on APIs

Issue 1: In Microservices, services can be built in multiple languages. And each language returns error response in its own way. 
Solution: Create a middleware with error handlers. 

We need to pass more information to error handles so that it can send back appropriate response.

