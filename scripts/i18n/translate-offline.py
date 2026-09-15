import json,time,pathlib,sys
import argostranslate.translate as t
items=json.load(open(sys.argv[1]))
out=pathlib.Path(sys.argv[2])
translations=json.loads(out.read_text()) if out.exists() else {}
translator=t.get_translation_from_codes('zh','en')
start=time.time()
for i,s in enumerate(items):
 if s not in translations:translations[s]=translator.translate(s)
 if i%50==0:
  out.write_text(json.dumps(translations,ensure_ascii=False,indent=2))
  print(i,len(items),round(time.time()-start),flush=True)
out.write_text(json.dumps(translations,ensure_ascii=False,indent=2))
print('DONE',len(translations),flush=True)
