import React from 'react';



function AdminRow ({ id, title, description, price,  handleDelete}) {
		return(
			<tr>
				<td>{id}</td>
				<td>{title}</td>
				<td>{description}</td>
				<td>{price}</td>
                <td>
                <button onClick={() => handleDelete(id)}  className = "btn btn-outline-danger btn-sm mr-2">Delete</button>
            </td>
            </tr>

		);


}
export default AdminRow;