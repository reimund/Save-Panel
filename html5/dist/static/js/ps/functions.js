//@include Json.js
//@include Saver.js

this.se_lumens_savepanel = {
	//save: function(args) {
		//var preset, s;

		//preset = Json.eval(args[0]);
		//s      = new sp.Saver();
		//s.save(preset);
	//},
	updatePanelSize: function(args) {
		var dir, file, lines, line;

		dir   = new File($.fileName).parent.parent.parent.parent.parent;
		file  = new File(dir + '/Save panel.xml');
		lines = [];

		if (file.open('r')) {
			while(line = file.readln())
				lines.push(line);

			line     = lines[4];
			line     = line.replace(/width="\d+"/, 'width="' + args[0] + '"');
			line     = line.replace(/height="\d+"/, 'height="' + args[1] + '"');
			lines[4] = line;
			file.close();
		}

		if (file.open('w')) {
			for (i in lines)
				file.writeln(lines[i]);
			file.close();
		}
	}
};
