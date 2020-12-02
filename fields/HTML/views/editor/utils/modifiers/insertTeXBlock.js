/**
 * Copyright (c) Facebook, Inc. and its affiliates. All rights reserved.
 *
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict'

import { AtomicBlockUtils, EditorState } from 'draft-js'

let count = 0
const examples = ['我是禮義', '好想吃飯', '牛排好吃']

export function insertTeXBlock(editorState) {
    const contentState = editorState.getCurrentContent()
    const nextFormula = count++ % examples.length
    const contentStateWithEntity = contentState.createEntity(
        'TOKEN',
        'IMMUTABLE',
        { content: examples[nextFormula] }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity,
    })
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
}