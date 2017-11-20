import React, { Component }          from "react"

import ScoreEditor       from "./ScoreEditor"
import UndoControl       from "./UndoControl"
import KeyControl        from "./KeyControl"
import ClearButton       from "./ClearButton"
import SetSampleButton   from "./SetSampleButton"
import InstrumentControl from "./InstrumentControl"
import BeatControl       from "./BeatControl"
import BpmControl        from "./BpmControl"
import ClickControl      from "./ClickControl"
import VolumeControl     from "./VolumeControl"
import SoundControl      from "./SoundControl"
import * as utils        from "../../utils"

export default class Score extends Component {
  handleChangeEditorState = (editorState) => {
    this.props.handleSetState({ editorState }, false)
    this.props.setInputText(editorState.getCurrentContent().getPlainText(), false)
  }
  render() {
    const {
      hideLabel, inputText, editorState, instrumentType, beat, bpm, volume,
      enabledClick, isPlaying, handleSetState, setInputText
    } = this.props
    const parsedText = utils.parseChordProgression(inputText)

    return (
      <div className="field">
        {!hideLabel && (
          <label className="label">Score</label>
        )}
        <div className="control">
          <div className="columns">
            <div className="column control">
              <ScoreEditor
                inputText={inputText}
                editorState={editorState}
                handleChangeEditorState={this.handleChangeEditorState}
                readOnly={isPlaying}
              />
            </div>

            <div className="column control-ui">
              <div className="columns">
                <div className="column editor-control">
                  <UndoControl
                    editorState={editorState}
                    handleChangeEditorState={this.handleChangeEditorState}
                    disabled={isPlaying}
                  />
                  <KeyControl
                    inputText={inputText}
                    setInputText={setInputText}
                    disabled={isPlaying}
                  />
                  <ClearButton
                    setInputText={setInputText}
                    disabled={isPlaying}
                  />
                  <SetSampleButton
                    setInputText={setInputText}
                    disabled={isPlaying}
                  />
                </div>

                <div className="column">
                  <InstrumentControl
                    instrumentType={instrumentType}
                    handleSetState={handleSetState}
                    disabled={isPlaying}
                  />
                  <BeatControl
                    beat={beat}
                    handleSetState={handleSetState}
                    disabled={isPlaying}
                  />
                  <BpmControl
                    bpm={bpm}
                    handleSetState={handleSetState}
                  />
                  <ClickControl
                    enabledClick={enabledClick}
                    handleSetState={handleSetState}
                  />
                </div>
              </div>
              <SoundControl
                instrumentType={instrumentType}
                beat={beat}
                bpm={bpm}
                volume={volume}
                enabledClick={enabledClick}
                parsedText={parsedText}
                isPlaying={isPlaying}
                handleSetState={handleSetState}
              />
              <VolumeControl
                volume={volume}
                handleSetState={handleSetState}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}