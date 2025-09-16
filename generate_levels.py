import json, random, os

levels = []
for i in range(5):
    level = {
        "id": i+1,
        "enemies": [{"type":"gmunk","x":random.randint(50,750),"y":-50} for _ in range(10+i*5)],
        "obstacles": [{"x":random.randint(0,750),"y":-random.randint(100,500)} for _ in range(5+i*2)]
    }
    levels.append(level)

os.makedirs("../data", exist_ok=True)
with open("../data/levels.json","w") as f:
    json.dump(levels,f,indent=2)

print("✅ Levels generated!")