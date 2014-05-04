#! /bin/bash

for i in `ls`
do
	echo "\lstinputlisting[language=PHP, caption=$i]{contenu/annexes/MemoLanguage_Client/$i}" >> sortie
done
