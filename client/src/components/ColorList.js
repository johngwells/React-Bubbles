import React, { useState } from "react";
import { axiosWithAuth } from "./utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors, location, ...props }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  /*
  const item = colors.find(
    color => `${color.id}` === props.match.params.id
  );
  */

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        updateColors(colors.map(color => 
          color.id === colorToEdit.id ? res.data : color
          ));
          setEditing(false);
      })
      .catch(err => console.log('Did not save to color list', err));
      setColorToEdit({
        color: '',
        code: {hex: ''}
      });
  };

  /*
  const deleteColorHandler = id => {
    return colors.filter(color => color.id !== id)
  } 
  */

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`)
      .then(res => {
        renderColors()
        // props.history.push('/bubbles')
      })
      .catch(err => {
        console.log('delete', err)
      });
  };

  const renderColors = () => {
    // after delete
    axiosWithAuth()
      .get('/api/colors')
      .then(res => {
        updateColors(res.data)
        setEditing(false)
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
