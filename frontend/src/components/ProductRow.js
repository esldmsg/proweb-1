import React from 'react';



function ProductRow ({ id, title, description, price}) {
		return(
			<tr>
				<td>{id}</td>
				<td>{title}</td>
				<td>{description}</td>
				<td>{price}</td>
            </tr>

		);


}
export default ProductRow;