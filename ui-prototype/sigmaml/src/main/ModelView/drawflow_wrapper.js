import Drawflow from 'drawflow';

export default class DrawflowMod extends Drawflow {
	createCurvature(start_pos_x, start_pos_y, end_pos_x, end_pos_y, curvature_value, type) {
		var line_x = start_pos_x;
		var line_y = start_pos_y;
		var x = end_pos_x;
		var y = end_pos_y;
		var curvature = curvature_value;
		//type openclose open close other
		switch (type) {
		case 'open':
			if(start_pos_y >= end_pos_y) {
				var hy1 = line_y + Math.abs(y - line_y) * curvature;
				var hy2 = y - Math.abs(y - line_y) * (curvature*-1);
			} else {
				var hy1 = line_y + Math.abs(y - line_y) * curvature;
				var hy2 = y - Math.abs(y - line_y) * curvature;
			}
			return ' M '+ line_x +' '+ line_y +' C '+ line_x +' '+ hy1 +' '+ x +' ' + hy2 +' ' + x +' ' + y;

			break
		case 'close':
			if(start_pos_y >= end_pos_y) {
				var hy1 = line_y + Math.abs(y - line_y) * (curvature*-1);
				var hy2 = y - Math.abs(y - line_y) * curvature;
			} else {
				var hy1 = line_y + Math.abs(y - line_y) * curvature;
				var hy2 = y - Math.abs(y - line_y) * curvature;
			}
			return ' M '+ line_x +' '+ line_y +' C '+ line_x +' '+ hy1 +' '+ x +' ' + hy2 +' ' + x +' ' + y;
			break;
		case 'other':
			if(start_pos_y >= end_pos_y) {
				var hy1 = line_y + Math.abs(y - line_y) * (curvature*-1);
				var hy2 = y - Math.abs(y - line_y) * (curvature*-1);
			} else {
				var hy1 = line_y + Math.abs(y - line_y) * curvature;
				var hy2 = y - Math.abs(y - line_y) * curvature;
			}
			return ' M '+ line_x +' '+ line_y +' C '+ line_x +' '+ hy1 +' '+ x +' ' + hy2 +' ' + x +' ' + y;
			break;
		default:

			var hy1 = line_y + Math.abs(y - line_y) * curvature;
			var hy2 = y - Math.abs(y - line_y) * curvature;

			return ' M '+ line_x +' '+ line_y +' C '+ line_x +' '+ hy1 +' '+ x +' ' + hy2 +' ' + x +' ' + y;
		}
	}
}