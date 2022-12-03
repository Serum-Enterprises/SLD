const Node = require('../Util/Node.class');
const Result = require('../Util/Result.class');

/**
 * This Library provides Rules for all ASCII Control and Structural Characters
 */


const ASCII = {
	Control: {
		Null: (precedingNode, codeString) => {
			const match = codeString.match(/^\x00/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.Null', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		StartOfHeading: (precedingNode, codeString) => {
			const match = codeString.match(/^\x01/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.StartOfHeading', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		StartOfText: (precedingNode, codeString) => {
			const match = codeString.match(/^\x02/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.StartOfText', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		EndOfText: (precedingNode, codeString) => {
			const match = codeString.match(/^\x03/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.EndOfText', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		EndOfTransmission: (precedingNode, codeString) => {
			const match = codeString.match(/^\x04/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.EndOfTransmission', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Enquiry: (precedingNode, codeString) => {
			const match = codeString.match(/^\x05/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.Enquiry', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Acknowledge: (precedingNode, codeString) => {
			const match = codeString.match(/^\x06/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.Acknowledge', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Bell: (precedingNode, codeString) => {
			const match = codeString.match(/^\x07/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.Bell', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Backspace: (precedingNode, codeString) => {
			const match = codeString.match(/^\x08/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.Backspace', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		HorizontalTab: (precedingNode, codeString) => {
			const match = codeString.match(/^\x09/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.HorizontalTab', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		LineFeed: (precedingNode, codeString) => {
			const match = codeString.match(/^\x0A/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.LineFeed', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		VerticalTab: (precedingNode, codeString) => {
			const match = codeString.match(/^\x0B/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.VerticalTab', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		FormFeed: (precedingNode, codeString) => {
			const match = codeString.match(/^\x0C/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.FormFeed', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		CarriageReturn: (precedingNode, codeString) => {
			const match = codeString.match(/^\x0D/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.CarriageReturn', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		ShiftOut: (precedingNode, codeString) => {
			const match = codeString.match(/^\x0E/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.ShiftOut', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		ShiftIn: (precedingNode, codeString) => {
			const match = codeString.match(/^\x0F/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.ShiftIn', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		DataLinkEscape: (precedingNode, codeString) => {
			const match = codeString.match(/^\x10/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.DataLinkEscape', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		DeviceControl1: (precedingNode, codeString) => {
			const match = codeString.match(/^\x11/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.DeviceControl1', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		DeviceControl2: (precedingNode, codeString) => {
			const match = codeString.match(/^\x12/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.DeviceControl2', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		DeviceControl3: (precedingNode, codeString) => {
			const match = codeString.match(/^\x13/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.DeviceControl3', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		DeviceControl4: (precedingNode, codeString) => {
			const match = codeString.match(/^\x14/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.DeviceControl4', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		NegativeAcknowledge: (precedingNode, codeString) => {
			const match = codeString.match(/^\x15/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.NegativeAcknowledge', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		SynchronousIdle: (precedingNode, codeString) => {
			const match = codeString.match(/^\x16/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.SynchronousIdle', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		EndOfTransmissionBlock: (precedingNode, codeString) => {
			const match = codeString.match(/^\x17/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.EndOfTransmissionBlock', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Cancel: (precedingNode, codeString) => {
			const match = codeString.match(/^\x18/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.Cancel', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		EndOfMedium: (precedingNode, codeString) => {
			const match = codeString.match(/^\x19/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.EndOfMedium', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Substitute: (precedingNode, codeString) => {
			const match = codeString.match(/^\x1A/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.Substitute', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Escape: (precedingNode, codeString) => {
			const match = codeString.match(/^\x1B/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.Escape', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		FileSeparator: (precedingNode, codeString) => {
			const match = codeString.match(/^\x1C/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.FileSeparator', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		GroupSeparator: (precedingNode, codeString) => {
			const match = codeString.match(/^\x1D/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.GroupSeparator', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		RecordSeparator: (precedingNode, codeString) => {
			const match = codeString.match(/^\x1E/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.RecordSeparator', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		UnitSeparator: (precedingNode, codeString) => {
			const match = codeString.match(/^\x1F/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.UnitSeparator', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Delete: (precedingNode, codeString) => {
			const match = codeString.match(/^\x7F/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Control.Delete', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		}
	},
	Structural: {
		Space: (precedingNode, codeString) => {
			const match = codeString.match(/^\x20/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.Space', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		ExclamationMark: (precedingNode, codeString) => {
			const match = codeString.match(/^\x21/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.ExclamationMark', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		DoubleQuote: (precedingNode, codeString) => {
			const match = codeString.match(/^\x22/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.DoubleQuote', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		NumberSign: (precedingNode, codeString) => {
			const match = codeString.match(/^\x23/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.NumberSign', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		DollarSign: (precedingNode, codeString) => {
			const match = codeString.match(/^\x24/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.DollarSign', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		PercentSign: (precedingNode, codeString) => {
			const match = codeString.match(/^\x25/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.PercentSign', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Ampersand: (precedingNode, codeString) => {
			const match = codeString.match(/^\x26/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.Ampersand', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Apostrophe: (precedingNode, codeString) => {
			const match = codeString.match(/^\x27/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.Apostrophe', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		LeftParenthesis: (precedingNode, codeString) => {
			const match = codeString.match(/^\x28/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.LeftParenthesis', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		RightParenthesis: (precedingNode, codeString) => {
			const match = codeString.match(/^\x29/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.RightParenthesis', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Asterisk: (precedingNode, codeString) => {
			const match = codeString.match(/^\x2A/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.Asterisk', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		PlusSign: (precedingNode, codeString) => {
			const match = codeString.match(/^\x2B/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.PlusSign', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Comma: (precedingNode, codeString) => {
			const match = codeString.match(/^\x2C/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.Comma', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		HyphenMinus: (precedingNode, codeString) => {
			const match = codeString.match(/^\x2D/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.HyphenMinus', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		FullStop: (precedingNode, codeString) => {
			const match = codeString.match(/^\x2E/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.FullStop', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Slash: (precedingNode, codeString) => {
			const match = codeString.match(/^\x2F/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.Slash', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Colon: (precedingNode, codeString) => {
			const match = codeString.match(/^\x3A/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.Colon', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Semicolon: (precedingNode, codeString) => {
			const match = codeString.match(/^\x3B/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.Semicolon', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		LessThanSign: (precedingNode, codeString) => {
			const match = codeString.match(/^\x3C/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.LessThanSign', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		EqualsSign: (precedingNode, codeString) => {
			const match = codeString.match(/^\x3D/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.EqualsSign', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		GreaterThanSign: (precedingNode, codeString) => {
			const match = codeString.match(/^\x3E/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.GreaterThanSign', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		QuestionMark: (precedingNode, codeString) => {
			const match = codeString.match(/^\x3F/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.QuestionMark', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		CommercialAt: (precedingNode, codeString) => {
			const match = codeString.match(/^\x40/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.CommercialAt', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		LeftSquareBracket: (precedingNode, codeString) => {
			const match = codeString.match(/^\x5B/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.LeftSquareBracket', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		ReverseSolidus: (precedingNode, codeString) => {
			const match = codeString.match(/^\x5C/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.ReverseSolidus', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		RightSquareBracket: (precedingNode, codeString) => {
			const match = codeString.match(/^\x5D/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.RightSquareBracket', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		CircumflexAccent: (precedingNode, codeString) => {
			const match = codeString.match(/^\x5E/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.CircumflexAccent', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		LowLine: (precedingNode, codeString) => {
			const match = codeString.match(/^\x5F/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.LowLine', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		GraveAccent: (precedingNode, codeString) => {
			const match = codeString.match(/^\x60/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.GraveAccent', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		LeftCurlyBracket: (precedingNode, codeString) => {
			const match = codeString.match(/^\x7B/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.LeftCurlyBracket', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		VerticalLine: (precedingNode, codeString) => {
			const match = codeString.match(/^\x7C/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.VerticalLine', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		RightCurlyBracket: (precedingNode, codeString) => {
			const match = codeString.match(/^\x7D/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.RightCurlyBracket', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		},
		Tilde: (precedingNode, codeString) => {
			const match = codeString.match(/^\x7E/);

			if(!match)
				return null;

			return new Result(
				Node.createNode(precedingNode, 'ASCII.Structural.Tilde', match[0], match[0]),
				codeString.slice(match[0].length)
			);
		}
	}
}

module.exports = ASCII;