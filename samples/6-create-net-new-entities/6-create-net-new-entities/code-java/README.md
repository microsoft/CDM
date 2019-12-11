# Setup and Running Program.java

## Environment

Java 9+ JDK

Maven 3.6.1+

## Build the CDM SDK JAR file

Run `mvn clean install`

**Take a note of the version of commondatamodel you are building, and the path to your .m2 directory. You should be able to see it at the last few message before the build is finish.**

## Build the Program.java

1. Update the `pom.xml`.Update the properties under the `<properties>` tag.
2. Run `mvn clean install`
3. Run `java -cp <C:\WORKPLACE>\target\code-java-1.0-SNAPSHOT.jar;<C:\PATH\TO\M2>\repository\com\microsoft\commondatamodel\objectmodel\<COMMON-DATA-VERSION>\objectmodel-<COMMON-DATA-VERSION>-jar-with-dependencies.jar example.Program`