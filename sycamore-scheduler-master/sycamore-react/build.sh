#!/bin/bash
# Compiles the Sycamore Scheduler React.js app into static .html/.css/.js that is built with some Java Servlets in the backend
# (using Maven) to create a directory (/sycamore-maven/target/SycamoreScheduler) that can be deployed on any Tomcat server.
PROJ_DIR='/Users/sajeev/git/sycamore-scheduler/sycamore-react'
cd ${PROJ_DIR}
npm run build
cd '../sycamore-maven/web/'
rm -r static *.js *.json *.html *.ico *.png
cd '../../sycamore-react/build/'
cp -r * ../../sycamore-maven/web/
cd '../../sycamore-maven'
mvn package
cd '../sycamore-react'
