import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//////////////// IMPORTING IMAGES AND ICONS //////////////////////////
import dots from "@assets/3dots.svg";
import folderOpenIcon from "@assets/folder-open.svg";
import trash from "@assets/trashlrg.svg";
import edit from "@assets/properties-icon.svg";

import ClickAwayListener from "@helpers/ClickAwayListener";
import { getSingleDirectory } from "@api/api";
import { PencilIconBlack } from "@utils/icons";

//////////////////////////// START OF MAIN FUNCTION /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
export default function Folder({
  id,
  name,
  setIsFolderAddModalOpen,
  setSelectedFolderId,
  setFolderName,
  draggingFolderId,
  setDraggingFolderId,
  draggingDocId,
  setDraggingDocId,
  moveSelectedDirectory,
  moveDocument,
  handleDelete,
  setSelectedFolderHeading,
  selectedFolderHeading,
  setIsDragOverDrive,
  onFolderDrop,
  removedFolderId,
  folderDropData,
}) {
  const [isFolderMenu, setIsFolderMenu] = useState(false);
  const [docsLength, setDocsLength] = useState(0);
  const [folderHoverStyles, setFolderHoverStyles] = useState("");

  //////// FUNCTION TO GET LENGTH OF FILES TO EVERY FOLDER
  // useEffect(() => {
  //   if (removedFolderId === id) return;

  //   async function fetchData() {
  //     const { data } = await getSingleDirectory(id);
  //     setDocsLength(data.files.length);
  //   }
  //   fetchData();
  // }, [id, folderDropData]);

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();

    if (draggingDocId) {
      setFolderHoverStyles("border-[#2A47AB] bg-[#DBE0E5]");
      return;
    }

    // if (draggingFolderId || draggingDocId) return;
    if (draggingFolderId) return;

    setSelectedFolderHeading(name);
    setIsDragOverDrive(false);
  }

  function handleDragLeave(e) {
    const relatedTarget = e.relatedTarget;

    if (
      !relatedTarget ||
      (relatedTarget !== e.currentTarget &&
        !e.currentTarget.contains(relatedTarget))
    ) {
      setSelectedFolderHeading("");
      setFolderHoverStyles("");
    }
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();

    setDraggingFolderId(id);
    setDraggingDocId("");
  }

  async function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    /// if files are dragged directly into computer
    if (selectedFolderHeading) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFolderDrop(droppedFiles, id);
    }

    //// if file is dragged into a folder
    if (draggingDocId) {
      moveDocument(id);
    }

    ///// if folder is dragged into another folder
    if (draggingFolderId) {
      moveSelectedDirectory(id);
    }

    setFolderHoverStyles("");
    setDraggingDocId("");
    setDraggingFolderId("");
  }

  return (
    // <Link to={`/dashboard/drive/folder/${id}`}>
    <div
      className={`flex items-center gap-4 h-full border-[2px] relative px-3 py-5 rounded-md shadow-[0_8px_24px_#1B2E5E14] 2xl:w-[258px] ${
        folderHoverStyles || "bg-white border-[#ffffff]"
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDrag={handleDrag}
      onDragLeave={handleDragLeave}
      draggable
    >
      <img
        src={folderOpenIcon}
        alt="Folder Open Icon"
        loading="lazy"
        className="w-[35px] h-[35px]"
      />
      <div className="flex-1">
        <div className="flex justify-between gap-1 mb-1">
          <h4 className="font-semibold break-words">{name}</h4>

          <ClickAwayListener
            onClickAway={() => setIsFolderMenu(false)}
            className="relative"
          >
            <img
              src={dots}
              alt="Three Dots"
              className="cursor-pointer ml-auto"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setIsFolderMenu(!isFolderMenu);
              }}
            />
            {isFolderMenu && (
              <div className="absolute right-1 top-[100%] rounded-md z-[2] bg-white shadow-md p-2 w-[128px]">
                <button
                  type="button"
                  className="flex gap-2 items-center w-full text-sm font-normal px-2 py-1 hover:bg-[#EFEFEF]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setIsFolderAddModalOpen(true);
                    setSelectedFolderId(id);
                    setFolderName(name);
                  }}
                >
                  <span className="">
                    <PencilIconBlack />
                  </span>
                  Rename
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    handleDelete(id);
                  }}
                  className="flex items-center gap-2 text-red-600 py-1 px-2 text-sm disabled:opacity-60 cursor-pointer select-none w-full hover:bg-[#EFEFEF]"
                >
                  <img
                    src={trash}
                    alt="icon"
                    loading="lazy"
                    className="mr-[2px]"
                  />
                  Delete
                </button>
              </div>
            )}
          </ClickAwayListener>
        </div>
        <p className="text-[12px] text-[#5B6B79]">{docsLength} Files</p>
      </div>
    </div>
    // </Link>
  );
}
