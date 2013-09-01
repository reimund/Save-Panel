Save Panel
==========

by Reimund Trost <reimund@code7.se>
Website <http://lumens.se/tools/savepanel/>


Automatic installation
======================

Photoshop CS 6 / CC
-------------------

1. Open savepanel.zxp in Adobe Extension Manager.
2. Install by following the steps shown.
3. Enjoy.

Photoshop CS 5
--------------

1. Open savepanel.zxp in Adobe Extension Manager.
2. Install by following the steps shown.
3. Follow steps 3-5 under Manual installation, Photoshop CS5.

Note: on some machines you might need to run Adobe Extension Manager with
administrator rights. See 'Notes on running with administrator rights' below.


Manual installation
===================

Before installing, make sure any old Save Panel files have been removed.


Photoshop CS 6 / CC
-------------------

1. Copy the Save Panel directory (residing in the "panels/cs6" directory) to 
   <Photoshop>/Plug-ins/Panels.

2. Run Photoshop and show the panel by going to Window/Extensions/Save Panel.


Photoshop CS 5
--------------

The steps are similar for CS5, but you need a few extra steps:

1. Copy the Save Panel directory (residing in the "panels/cs5" directory) to 
   <Photoshop>/Plug-ins/Panels.

2. Copy the Save Panel directory (residing in the "scripts" directory) to
   <Photoshop CS5>/Presets/Scripts.

3. Start Photoshop as administrator.

4. Run the 'Save Panel CS5 Fix' script from File > Scripts > Save Panel CS5 Fix
   Note that this step will fail if you don't run Photoshop with administrator
   rights (read more below).

5. Restart Photoshop and show the panel by going to Window/Extensions/Save Panel.


Notes on running with administrator rights
==========================================

You might have to start Extension Manager or Photoshop with administrator
rights. To do so, follow these steps.

On Windows: right click the Adobe Extension Manager or Photoshop executable and
choose Run as administrator.

On Mac OSX: start a terminal window and run the following command (change CS5
to your Photoshop version):
sudo "/Applications/Adobe Extension Manager CS5/Adobe Extension Manager CS5.app/Contents/MacOS/Adobe Extension Manager CS5"

