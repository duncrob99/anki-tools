#!/usr/bin/env sh

filenames=(*)
file_prefix="_duncrob99-anki-tools-"
user="User 1"
media_location="$HOME/.local/share/Anki2/$user/collection.media"

for file in "${filenames[@]}"
do
	echo "file: "
	echo $file
	if [ "$file" != "linker.sh" ] && [ "$file" != "README.md" ]; then
		echo "linking file"
		ln -siv "$(realpath $file)" "$media_location/$file_prefix$file"
	fi
done
