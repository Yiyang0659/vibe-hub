"""Merge source strings and rendered HTML text for offline translation."""
import json,re,sys
from html.parser import HTMLParser
strings=set(json.load(open(sys.argv[1])))
class TextCollector(HTMLParser):
 def handle_data(self,value):
  if re.search('[\u4e00-\u9fff]',value):strings.add(value.strip())
 def handle_starttag(self,tag,attrs):
  for key,value in attrs:
   if key in ['title','aria-label','placeholder','alt'] and value and re.search('[\u4e00-\u9fff]',value):strings.add(value)
for path in sys.argv[3:]:TextCollector().feed(open(path).read())
with open(sys.argv[2],'w') as out:json.dump(sorted(strings),out,ensure_ascii=False)
print(len(strings),'unique source strings')
