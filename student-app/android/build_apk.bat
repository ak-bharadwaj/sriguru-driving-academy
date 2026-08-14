@echo off
SET JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
SET PATH=%JAVA_HOME%\bin;%PATH%
echo Using Java:
java -version
echo.
echo Building debug APK...
call gradlew.bat assembleDebug
