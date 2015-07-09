Save Panel
==========

Version 1.2.0 - Thu 09 Jul 2015

by Reimund Trost <reimund@code7.se>  
Website <http://lumens.se/tools/savepanel/>


Description
-----------
Save Panel is an extension for Adobe Photoshop that speeds up the file saving
process by allowing you direct access to save presets via a custom panel.


Features
--------
- Create save presets.
- Automatically creates missing directories.
- Save to either a path relative to the current file or to an absolute file.
- Custom filename: Append or prepend a suffix/prefix to the current filename or
  set the filename entirely.
- Save jpg, png or psd.
- Apply resize to fit dimension before saving.
- Apply custom action before saving.
- Option to automatically close the file after it's been saved.
- Categorise similar buttons under a common heading.
- Photoshop CS5, CS6, CC and CC 2014 support.
  
Note that the new html panel will not work in earlier versions than CC 2014.
For CS5-CC, use the older flash based panel.


Installation (CC 2014)
----------------------
1.	From the terminal, change directory to the __html5__ directory.
3.	Install build/savepanel.zxp with Adobe Extension Manager.

Installation (CC 2014, CC 2015) - Html5 panel
---------------------------------------------

1. Build the panel by running `./package <your_password>` (you will need to replace lumens.p12 with your own self-signing certificate).

2. Install using installer script. In Photoshop, goto File > Scripts > Browse...

2. Select the installer.jsx that corresponds to your Photoshop version.

3. Restart Photoshop.

4. Enable the panel via __Window/Extensions/Tych Panel__ in Photoshop.

Installation (pre CC 2014)
--------------------------
1.	Copy __flash-panel/scripts/Save Panel__ to __<your photoshop directory>/Presets/Scripts__.
2.	Open __flash-panel/Save Panel <version>.gpc__ in Adobe Configurator and export it to
	__<your photoshop directory>/Plug-ins/Panels__.
3.	Enable the panel via __Window/Extensions/Save Panel__ in Photoshop.


Changelog
=========

1.2.0
-----
*   Added installer script for installing without Adobe Extension Manager.

1.1.0
-----
- Ported Configurator based panel to html panel.
- CC 2014 support.
- Allow dupicate preset names.
- Various changes to the options dialog. 

1.0.5
-----
- Fix issue breaking save on Windows network paths beginning with 
  double-slash (//).

1.0.4
-----
- Enabled png (lossless) compression.

1.0.3
-----
- Fixed problem on some Windows machines where paths beginning with 'file://'
  did not resolve.

1.0.2
-----
- Fixed problem with saving an unsaved document to an absolute path.
- Fixed issue with Custom action dropdowns not being properly populated.
- Moved New button.

1.0.1
-----
- Fixed path issue preventing save in some settings.

1.0.0
-----
- Save button now creates new preset if no prior presets exist.
- Fixed some issues with absolute paths.

0.9.7
-----
- Added statusbar (CS6 & later only).
- Added ability to collapse button groups.
- Complete color theme support (light/medium/dark/darker now available).

0.9.6
-----
- CS5 support.
- Basic theming in CS6/CC (light/dark).
- Writes presets to Photoshop's preferences folder.

0.9.5
-----
- Total rewrite. Now with dynamic panel and save presets.

0.1.0
-----
- Added icon.
- Made CS6 panel match the default (dark) theme of PS CS6.

0.0.3
-----
- Added buttons for 820/920 sizes.

0.0.2
-----
- Psd support.

0.0.1
-----
- Save full sized jpeg with/without bw suffix.
