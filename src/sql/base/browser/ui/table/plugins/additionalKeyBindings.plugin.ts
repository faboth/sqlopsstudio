/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { StandardKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';

/**
 * Implements the various additional navigation  keybindings we want out of slickgrid
 */
export class AdditionalKeyBindings<T> implements Slick.Plugin<T> {
	private grid: Slick.Grid<T>;
	private handler = new Slick.EventHandler();

	public init(grid: Slick.Grid<T>) {
		this.grid = grid;
		this.handler.subscribe(this.grid.onKeyDown, (e, args) => this.handleKeyDown(e, args));
	}

	public destroy() {
		this.handler.unsubscribeAll();
	}

	private handleKeyDown(e: KeyboardEvent, args: Slick.OnKeyDownEventArgs<T>): void {
		let event = new StandardKeyboardEvent(e);
		let handled = true;

		if (event.equals(KeyCode.RightArrow | KeyMod.CtrlCmd)) {
			this.grid.setActiveCell(args.row, this.grid.getColumns().length - 1);
		} else if (event.equals(KeyCode.LeftArrow | KeyMod.CtrlCmd)) {
			// account for row column
			if (this.grid.canCellBeActive(args.row, 0)) {
				this.grid.setActiveCell(args.row, 0);
			} else {
				this.grid.setActiveCell(args.row, 1);
			}
		} else if (event.equals(KeyCode.Home | KeyMod.CtrlCmd)) {
			// account for row column
			if (this.grid.canCellBeActive(0, 0)) {
				this.grid.setActiveCell(0, 0);
			} else {
				this.grid.setActiveCell(0, 1);
			}
		} else if (event.equals(KeyCode.End | KeyMod.CtrlCmd)) {
			this.grid.setActiveCell(this.grid.getDataLength() - 1, this.grid.getColumns().length - 1);
		} else {
			handled = false;
		}

		if (handled) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}

}
