"""Conservative WCAG text contrast budget for the composed background."""
from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parent.parent
css = (root / 'background.css').read_text()
base_css = (root / 'redesign.css').read_text()

def token(name):
    matches = re.findall(r'--' + re.escape(name) + r':\s*(#[0-9a-fA-F]{6})', base_css + css)
    return matches[-1]

def rgb(value):
    return [int(value[i:i+2], 16) / 255 for i in (1, 3, 5)]

def mix(front, back, alpha):
    return [a * alpha + b * (1-alpha) for a, b in zip(front, back)]

def luminance(color):
    return sum(weight * (value / 12.92 if value <= .04045 else ((value + .055) / 1.055) ** 2.4)
               for weight, value in zip([.2126, .7152, .0722], color))

def contrast(a, b):
    dark, light = sorted([luminance(a), luminance(b)])
    return (light + .05) / (dark + .05)

svg = ET.parse(root / 'assets/contours.svg').getroot()
group = svg.find('{http://www.w3.org/2000/svg}g')
assert group is not None
stroke = rgb(group.attrib['stroke'])
alpha = float(group.attrib['opacity'])
texture = re.search(r'--texture-ink:\s*rgb\((\d+) (\d+) (\d+) / ([.\d]+)\)', css)
assert texture
texture_color = [int(texture[i])/255 for i in (1, 2, 3)]
texture_alpha = float(texture[4])
# Charge the full contour stroke plus BOTH texture lines to every text position,
# even though contours and weave mostly stay at the edges. No white halo credit.
backgrounds = []
for name in ['canvas', 'wash-sage', 'wash-warm']:
    background = mix(stroke, rgb(token(name)), alpha)
    for _ in range(2):
        background = mix(texture_color, background, texture_alpha)
    backgrounds.append(background)
ratios = {name: min(contrast(rgb(token(name)), bg) for bg in backgrounds)
          for name in ['ink', 'muted', 'olive']}
for name, ratio in ratios.items():
    assert ratio >= 4.5, f'{name} falls below WCAG AA body text: {ratio:.2f}'
report = {'method': 'full contour + two weave strokes on each darkest color stop',
          'minimum_text_contrast': {name: round(ratio, 2) for name, ratio in ratios.items()}}
(root / 'work').mkdir(exist_ok=True)
(root / 'work/background-contrast.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
