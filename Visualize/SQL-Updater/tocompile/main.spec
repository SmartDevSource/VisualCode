# -*- mode: python ; coding: utf-8 -*-
from kivy_deps import sdl2, glew

a = Analysis(
    ['main.py'],
    pathex=['C:\\Users\\Megaport\\Desktop\\Exos Python\\KIVY\\Vizualise - SQL - Copie\\tocompile'],
    binaries=[],
    datas=[],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

a.datas += [('Code\main.py', 'C:\\Users\\Megaport\\Desktop\\Exos Python\\KIVY\\Vizualise - SQL - Copie\\tocompile\main.kv', 'DATA')]

coll = COLLECT(
    exe, Tree('C:\\Users\\Megaport\\Desktop\\Exos Python\\KIVY\\Vizualise - SQL - Copie\\tocompile'),
    a.binaries,
    a.datas,
    *[Tree(p) for p in (sdl2.dep_bins + glew.dep_bins)],
    strip=False,
    upx=True,
    upx_exclude=[],
    name='main',
)
