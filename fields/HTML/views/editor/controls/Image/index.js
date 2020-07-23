import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AtomicBlockUtils, EditorState, Modifier } from 'draft-js';
import { PanoramaOutlined } from '@material-ui/icons'

import GridSelector from '../../components/GridSelector'
import { setPages, setData } from '../../utils/fetchData';

const dataConfig = {
    list: 'Image',
    columns: ['title', 'urlDesktopSized'],
    maxItemsPerPage: 12,
}

const Image = (props) => {
    const { onChange, editorState } = props;
    const [pageNumbers, setPageNumbers] = useState(0);
    const [page, setPage] = useState(1);
    const [pagedData, setPagedData] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setPages(dataConfig, searchText, setPageNumbers);
    }, [searchText])

    useEffect(() => {
        setData(dataConfig, searchText, page, setPagedData);
    }, [searchText, pageNumbers, page])

    const saveData = selectedData => {
        const contentState = editorState.getCurrentContent();
        const entityKey = editorState
            .getCurrentContent()
            .createEntity('IMAGE', 'IMMUTABLE', selectedData)
            .getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' ',
        );

        onChange(newEditorState);
    }

    const ImageTile = props => {
        const { id, data, eventHandler } = props;
        const onClick = event => eventHandler(id);

        return (
            <img
                id={id}
                src={data.urlDesktopSized}
                alt={data.title}
                style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                }}
                onClick={onClick}
            />
        );
    };

    const ImageEditingTile = props => {
        const { data } = props;
        return (
            <img
                src={data.urlDesktopSized}
                alt={data.title}
                style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                }}
            />
        );
    };

    return (
        <GridSelector
            pageNumbers={pageNumbers}
            page={page}
            pagedData={pagedData}
            searchText={searchText}
            onPageChange={setPage}
            onSearchTextChange={setSearchText}
            onChange={saveData}
            ButtonIconComponent={PanoramaOutlined}
            TileComponent={ImageTile}
            EditingTileComponent={ImageEditingTile}
        />
    );
}

Image.propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
}

export default Image;
