Save Panel
==========

by Reimund Trost <reimund@code7.se>
Website <http://lumens.se/tools/savepanel/>


Photoshop CC 2014
-----------------

1. Open 'cc 2014/savepanel-x.y.z.zxp' in Adobe Extension Manager.
2. Install by following the steps shown.
3. Enjoy.



The following instructions are for the old Configurator based version of Save
Panel. This is included for compatibility with PS CS5, PS CS6 and PS CC.

Photoshop CS 6 / CC
-------------------

1. Open 'cs cc/savepanel-1.0.4.zxp' in Adobe Extension Manager.
2. Install by following the steps shown.
3. Enjoy.


Photoshop CS 5
--------------

1. Open 'cs cc/savepanel-1.0.4.zxp' in Adobe Extension Manager.
2. Install by following the steps shown.
3. Follow steps 3-5 under Manual installation, Photoshop CS5.

Note: on some machines you might need to run Adobe Extension Manager with
administrator rights. See 'Notes on running with administrator rights' below.


Manual installation
===================

Before installing, make sure any old Save Panel files have been removed.

Photoshop CS 6 / CC
-------------------

1. Rename 'cs cc/savepanel-1.0.4.zxp' to have a .zip extension.
2. Unzip the file.
3. Copy the Save Panel directory (residing in the "panels/cs6" directory) to 
   <Photoshop>/Plug-ins/Panels.
4. Run Photoshop and show the panel by going to Window/Extensions/Save Panel.


Photoshop CS 5
--------------

The steps are similar for CS5, but you need a few extra steps:

1. Rename 'cs cc/savepanel-1.0.4.zxp' to have a .zip extension.
2. Unzip the file.
3. Copy the Save Panel directory (residing in the "panels/cs5" directory) to 
   <Photoshop>/Plug-ins/Panels.
4. Copy the Save Panel directory (residing in the "scripts" directory) to
   <Photoshop CS5>/Presets/Scripts.
5. Start Photoshop as administrator.
6. Run the 'Save Panel CS5 Fix' script from File > Scripts > Save Panel CS5 Fix
   Note that this step will fail if you don't run Photoshop with administrator
   rights (read more below).
7. Restart Photoshop and show the panel by going to Window/Extensions/Save Panel.


Notes on running with administrator rights
==========================================

You might have to start Extension Manager or Photoshop with administrator
rights. To do so, follow these steps.

On Windows: right click the Adobe Extension Manager or Photoshop executable and
choose Run as administrator.

On Mac OSX: start a terminal window and run the following command (change CS5
to your Photoshop version):
sudo "/Applications/Adobe Extension Manager CS5/Adobe Extension Manager CS5.app/Contents/MacOS/Adobe Extension Manager CS5"

