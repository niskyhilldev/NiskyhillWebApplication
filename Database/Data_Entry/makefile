JAVAC = javac
JAVA = java
JAR = jar
MAIN = DataEntry
BUILD_DIR = build
CLASS_DIR = $(BUILD_DIR)/class
JDBC_JAR = $(BUILD_DIR)/postgresql-42.7.7.jar
FAT_JAR = dataentry.jar
MANIFEST = manifest.txt

all: prepare copy_jar compile manifest unpack jar move_jar

clean:
	rm -rf $(CLASS_DIR)
	rm -f $(FAT_JAR) $(MANIFEST)

prepare:
	mkdir -p $(CLASS_DIR)

copy_jar:
	@if [ ! -f $(JDBC_JAR) ]; then cp postgresql-42.7.7.jar $(BUILD_DIR)/; fi

compile:
	$(JAVAC) -cp $(JDBC_JAR) -d $(CLASS_DIR) $(MAIN).java

manifest:
	echo "Main-Class: $(MAIN)" > $(BUILD_DIR)/$(MANIFEST)

unpack:
	@if [ ! -d $(BUILD_DIR)/org ]; then cd $(BUILD_DIR) && $(JAR) xf postgresql-42.7.7.jar; fi

jar:
	$(JAR) cfm $(BUILD_DIR)/$(FAT_JAR) $(BUILD_DIR)/$(MANIFEST) -C $(CLASS_DIR) . -C $(BUILD_DIR) org -C $(BUILD_DIR) META-INF

move_jar:
	mv $(BUILD_DIR)/$(FAT_JAR) ./

run:
	$(JAVA) -jar $(FAT_JAR)

.PHONY: all clean prepare copy_jar compile manifest unpack jar move_jar run
