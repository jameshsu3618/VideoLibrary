import React, { useState } from 'react'
import { useTable, useRowSelect, usePagination } from 'react-table'
import awsconfig from "./s3-exports";
import Modal from "react-bootstrap/Modal";
import ReactPlayer from 'react-player'
import { API, graphqlOperation } from 'aws-amplify'
import { Storage } from 'aws-amplify';
import { updateVideo, deleteVideo } from './graphql/mutations'

const IndeterminateCheckbox = React.forwardRef(
	({ indeterminate, ...rest }, ref) => {
		const defaultRef = React.useRef()
		const resolvedRef = ref || defaultRef

		React.useEffect(() => {
				resolvedRef.current.indeterminate = indeterminate
		}, [resolvedRef, indeterminate])

		return (
				<>
					<input type="checkbox" ref={resolvedRef} {...rest} />
				</>
		)
	}
)

const Table = ({ columns, data }) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		canPreviousPage,
		canNextPage,
		pageOptions,
		page,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		selectedFlatRows,
		state: { selectedRowIds, pageIndex, pageSize  },
	} = useTable(
		{
			columns,
			data,
		},
			usePagination,
			useRowSelect,
			hooks => {
				hooks.visibleColumns.push(columns => [
					{
						id: 'selection',
						Header: ({ getToggleAllRowsSelectedProps }) => (
								<div>
										<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
								</div>
						),
						Cell: ({ row }) => (
								<div>
										<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
								</div>
						),
					},
						...columns,
					]
				)
			}
		)
	function upload(e, id){
		let file = e.target.files[0]
	
		Storage.put(file.name, file, {
			contentType: 'video/mp4'
		})
		.then (result => saveVideo(file, id))
		.catch(err => console.log(err));
		}
	
	function saveVideo(file, id){
		Storage.get(file.name)
		.then(result => 
			updatingVideo(id, `${awsconfig.cloudfront}${file.name}`, file.name)
		)
		.catch(err => console.log(err));
		}
		
	
	async function deletingVideo(id) {

		if (id == undefined) console.log('data is corrupted')
		try {
			const video = {id}
			await API.graphql(graphqlOperation(deleteVideo, {input: video}))
			setOpenModal(false)
			window.location.reload()
		} catch (err) {
			console.log('error deleting video:', err)
		}
	}
	async function updatingVideo(id, content="", name="", type="None") {
		if (id == undefined) console.log('data is corrupted')
		try {
			const video = {id, content, name, type}
			await API.graphql(graphqlOperation(updateVideo, {input: video}))
			setOpenModal(false)
		} catch (err) {
			console.log('error updating video:', err)
		}
	}
	const [openModal, setOpenModal] = useState(false);
	const [modalVideo, setModalVideo] = useState([]);
	function handleClick(name){
		setOpenModal(!openModal)
		setModalVideo(data.find(video => video.name == name.replace(/&amp;/g, '').replace(/&#39;/g, "")))
	}

	function hideModal(){
		setOpenModal(false)
	}

	// Render the UI for your table
	return (
		<>
			<Modal 
			show={openModal} 
			onHide={hideModal}
			style={{width: '80%', height: '80%', margin: 'auto', marginTop: '5rem'}}>
				<Modal.Header>
					<Modal.Title>Hi </Modal.Title>
				</Modal.Header>
				<Modal.Body>{(modalVideo.type == "youtube") ? (
                    <ReactPlayer  width='400px' height='400px' url={modalVideo.content} style={{margin:'auto'}}/>
                  ) : (
                    <video
                    id="my-video"
                    className="video-js"
                    controls
                    preload="auto"
                    width="400px"
					height="400px"
					style={{marginLeft:'32px', marginTop: '12px'}}
                    data-setup="{}"
                    >
                      <source src={modalVideo.content} type='video/mp4' />
                    ></video>
                  )}</Modal.Body>
				<Modal.Footer>
					<input 
					type="file"
					onChange={event => upload(event)}
					style={{margin: 'auto', paddingLeft: '6rem'}}
					/>
					<button onClick={()=>deletingVideo(modalVideo.id)}>delete video</button>
					<button onClick={hideModal}>Cancel</button>
				</Modal.Footer>
			</Modal>
			<table {...getTableProps()}>
				<thead>
						{headerGroups.map(headerGroup => (
								<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map(column => (
												<th {...column.getHeaderProps()}>{column.render('Header')}</th>
										))}
								</tr>
						))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row, i) => {
	
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
									{row.cells.map( (cell, index) => {
											return index == 2 ? <td {...cell.getCellProps()}><a onClick={(e)=>{handleClick(e.target.innerHTML)}}>{cell.render('Cell')}</a></td> : <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
									})}
							</tr>
						)
						})}
				</tbody>
			</table>
			<div className="pagination">
				<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
				{'<<'}
				</button>{' '}
				<button onClick={() => previousPage()} disabled={!canPreviousPage}>
				{'<'}
				</button>{' '}
				<button onClick={() => nextPage()} disabled={!canNextPage}>
				{'>'}
				</button>{' '}
				<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
				{'>>'}
				</button>{' '}
				<span>
				Page{' '}
				<strong>
					{pageIndex + 1} of {pageOptions.length}
				</strong>{' '}
				</span>
				<span>
				| Go to page:{' '}
				<input
					type="number"
					defaultValue={pageIndex + 1}
					onChange={e => {
					const page = e.target.value ? Number(e.target.value) - 1 : 0
					gotoPage(page)
					}}
					style={{ width: '100px' }}
				/>
				</span>{' '}
				<select
				value={pageSize}
				onChange={e => {
					setPageSize(Number(e.target.value))
				}}
				>
				{[10, 20, 30, 40, 50].map(pageSize => (
					<option key={pageSize} value={pageSize}>
					Show {pageSize}
					</option>
				))}
				</select>
			</div>
			
			</>
		)
}
export default Table