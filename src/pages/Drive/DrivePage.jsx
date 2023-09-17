import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

////////////////////// IMPORTING API FUNCTIONS //////////////////////////
import {
  createDirectory,
  updateDirectory,
  deleteDirectory,
  createFile,
  moveDirectory,
  updateFile,
  deleteFile,
  moveFile,
} from "@api/api";

////////////////////// IMPORTING IMAGES AND ICONS ////////////////////////
import searchIcon from "@assets/search-normal.png";
import plusSign from "@assets/add-blue-circle.svg";
import addLink from "@assets/addlink.svg";
import folderOpenSm from "@assets/folder-open-white.svg";
import driveWhite from "@assets/drive-white.svg";
import { CloseIconBlack, Spinner } from "@utils/icons";
import lod from "@assets/loader.svg";

//////////////////// IMPORINTG CUSTOM COMPONENTS ///////////////////////
import Document from "@components/Drive/Document";
import Folder from "@components/Drive/Folder";
import CustomModal from "@components/CustomModal";
import UploadDriveDocModal from "@components/Drive/UploadDriveDocModal";
import DriveDropDown from "@components/Drive/DriveDropDown";
import ClickAwayListener from "@helpers/ClickAwayListener";
import Avatar from "@components/Avatar";
import DropDown from "@components/DropDown";

// import { publishedDateOptions } from "@components/Search/SearchPageSearchBar";
import { getPastDate, validateField } from "@utils/helpers";
import { useToastContext } from "@context/toastContext";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";

import {
  fetchDriveData,
  updateAllFolders,
  updateAllDocs,
} from "@store/reducers/driveReducerSlice";
import { getAllFiles, getDirectories } from "@api/api";
import { extractFileExtension, formatDate, generateUID } from "@utils/helpers";

//////////////////////// START OF MAIN FUNCTION //////////////////////////
//////////////////////////////////////////////////////////////////////////
const DrivePage = () => {
  // const dispatch = useDispatch();
  // const { allDocs, allFolders } = useSelector((state) => state.drive);

  const [allFolders, setAllFolders] = useState([]);
  const [allDocs, setAllDocs] = useState([]);

  // const { setToast } = useToastContext();

  const [addDoc, setAddDoc] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [folderName, setFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(false);
  const [isfolderAddModalOpen, setIsFolderAddModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentFolders, setCurrentFolders] = useState([]);
  const [currentDocs, setCurrentDocs] = useState([]);
  const [removedFolderId, setRemovedFodlerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [draggingFolderId, setDraggingFolderId] = useState("");
  const [draggingDocId, setDraggingDocId] = useState("");
  const [selectedFolderHeading, setSelectedFolderHeading] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [folderDropData, setFolderDropData] = useState([]);

  const tagColors = ["#4CB592", "#4680FF", "#8451C5", "#FF6464"];

  const [selectedOptions, setSelectedOptions] = useState({
    tags: [],
    types: [],
    modified: "",
    users: "",
  });

  let publishedDateOptions = [
    { name: "Yesterday", value: "Yesterday" },
    { name: "Last week", value: "Last week" },
    { name: "Last Month", value: "Last Month" },
    { name: "Last 6 Months", value: "Last 6 Months" },
    { name: "Last Year", value: "Last Year" },
  ];

  let users = [
    { id: "1", name: "David" },
    { id: "2", name: "Labushance" },
    { id: "3", name: "Joey" },
  ];

  const drpOptions = [
    {
      name: "tags",
      title: "Tags",
      searchable: true,
      optionIcon: true,
      options: [
        ...availableTags.map((tag, i) => ({
          name: tag,
          bg: tagColors[i % tagColors.length],
        })),
      ],
      className: "min-w-[200px]",
      txtClass: " px-2 text-[#fff]",
      multiSelect: true,
    },
    {
      name: "types",
      title: "Type",
      searchable: false,
      optionIcon: true,
      options: [
        { name: "Product and Service" },
        { name: "Reference" },
        { name: "Certification" },
        { name: "Proposal" },
      ],
      className: "min-w-[200px]",
      txtClass: "",
      multiSelect: true,
    },
    {
      name: "modified",
      title: "Modified",
      searchable: false,
      optionIcon: true,
      static: true,
      options: publishedDateOptions,
      className: "min-w-[180px]",
      txtClass: "",
      multiSelect: false,
    },
    {
      name: "users",
      title: "Users",
      searchable: true,
      optionIcon: true,
      static: true,
      options: users,
      className: "min-w-[180px] right-0",
      txtClass: "",
      multiSelect: false,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: directories } = await getDirectories();
    setAllFolders(directories);

    const { data: files } = await getAllFiles();
    setAllDocs(files);
  }

  /////////// searching and filtering functionality //////////////
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (searchText) => {
    if (searchText) {
      const filtered = [...allDocs, ...allFolders].filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  // function to deal filter logic
  useEffect(() => {
    let filteredResults = [...allDocs, ...allFolders];

    // handle search filter
    if (searchResults.length > 0) {
      filteredResults = filteredResults.filter((item) =>
        searchResults.some((result) => result.id === item.id)
      );
    }

    // Handle tags filter (OR logic within tags)
    if (selectedOptions.tags.length > 0) {
      filteredResults = filteredResults.filter((item) =>
        selectedOptions.tags.some((tag) => item?.tags?.includes(tag))
      );
    }

    // Handle classification filter (OR logic within types)
    if (selectedOptions.types.length > 0) {
      const typeFilters = selectedOptions.types.map((option) =>
        option.toLowerCase().split(" ").join("_")
      );
      filteredResults = filteredResults.filter((item) =>
        typeFilters.includes(item.classification)
      );
    }

    // Handle period filter (AND logic for modified)
    if (selectedOptions.modified) {
      const selectedDate = getPastDate(selectedOptions.modified);
      filteredResults = filteredResults.filter(
        (item) =>
          new Date(item.updated_at) >= new Date(selectedDate) &&
          new Date(item.updated_at) < new Date()
      );
    }

    // Handle users filter (AND logic for user ids)
    // if (usersIds.length > 0) {
    //   filteredResults = filteredResults.filter((item) =>
    //     usersIds.includes(item.created_by)
    //   );
    // }

    if (
      !searchResults.length &&
      !selectedOptions.tags.length &&
      !selectedOptions.types.length &&
      !selectedOptions.modified
    ) {
      filteredResults = [];
    }

    if (filteredResults.length > 0) {
      let filteredDocs = [];
      filteredResults.forEach((result) => {
        const d = allDocs.find((doc) => doc.id === result.id);
        if (d) {
          if (!filteredDocs.some((result) => result.id === d.id)) {
            filteredDocs.push(d);
          }
        }
      });

      let filteredFolders = [];
      filteredResults.forEach((result) => {
        const f = allFolders.find((folder) => folder.id === result.id);
        if (f) {
          if (!filteredFolders.some((result) => result.id === f.id)) {
            filteredFolders.push(f);
          }
        }
      });

      setCurrentDocs(filteredDocs);
      setCurrentFolders(filteredFolders);
    } else if (
      filteredResults.length === 0 &&
      (searchValue ||
        selectedOptions.tags.length ||
        selectedOptions.types.length ||
        selectedOptions.modified)
    ) {
      setCurrentDocs([]);
      setCurrentFolders([]);
    } else {
      setCurrentDocs(allDocs);
      setCurrentFolders(allFolders);
    }

    ////////////////// set available tags ///////////////////
    const allTags = allDocs.flatMap((doc) => doc.tags);
    const uniqueTags = [...new Set(allTags)];
    setAvailableTags([...uniqueTags]);
  }, [selectedOptions, searchResults, allFolders, allDocs]);

  /////////////////////////// APIs Integration //////////////////////////
  //////////////// function to create new folder ////////////////////////
  async function createNewDirectory() {
    if (validateField(folderName)) {
      setIsFolderAddModalOpen(false);

      const newDirectory = {
        created_at: new Date(),
        updated_at: new Date(),
        name: folderName,
        created_by:
          users.find((user) => user.name === selectedOptions.users)?.id ||
          "Anonymous",
        parent_directory: null,
      };

      try {
        const { data: newFolder } = await createDirectory(newDirectory);

        setAllFolders([...allFolders, newFolder]);
        setFolderName("");
      } catch (err) {
        handleApiError(
          err,
          "Oops! Failed to create a new folder. Please refresh and try again."
        );
      }
    }
  }

  ///////////////////// update directory function ////////////////////
  async function updateSelectedDirectory(folderId) {
    if (validateField(folderName)) {
      setIsFolderAddModalOpen(false);
      setIsDataLoading(true);

      try {
        await updateDirectory(folderId, {
          name: folderName,
          updated_at: new Date(),
        });

        const updatedFolders = allFolders.map((folder) =>
          folder.id === folderId ? { ...folder, name: folderName } : folder
        );

        setAllFolders([...updatedFolders]);

        handleApiSuccess("Folder has been updated.");
        setFolderName("");
      } catch (err) {
        handleApiError(
          err,
          "Oops! Failed to update the folder. Please refresh and try again."
        );
      }
    }
  }

  ///////////////////// delete directory function ////////////////////
  async function deleteSelectedDirectory(folderId) {
    // setIsDataLoading(true);

    try {
      await deleteDirectory(folderId);

      const updatedFolders = allFolders.filter(
        (folder) => folder.id !== folderId
      );

      // setIsDataLoading(false);
      setAllFolders(updatedFolders);
      setRemovedFodlerId(folderId);
    } catch (err) {
      handleApiError(
        err,
        "Oops! Failed to delete the folder. Please refresh and try again."
      );
    }
  }

  ///////////////////// move directory function ////////////////////
  async function moveSelectedDirectory(dropTargetFolderId) {
    setIsDataLoading(true);

    if (
      draggingFolderId &&
      dropTargetFolderId &&
      draggingFolderId !== dropTargetFolderId
    ) {
      try {
        await moveDirectory(draggingFolderId, {
          parent_directory_id: dropTargetFolderId,
        });

        const updatedFolders = allFolders.filter(
          (folder) => folder.id !== draggingFolderId
        );
        setAllFolders(updatedFolders);

        handleApiSuccess("Folder has been moved.");
      } catch (err) {
        handleApiError(
          err,
          "Oops! Failed to delete the folder. Please refresh and try again."
        );
      }
    } else {
      setIsDataLoading(false);
    }
  }

  ///////////////////// create new file function ////////////////////
  async function createDocument(files, id = null) {
    if (!files.length) return;

    console.log({ files });

    const currentDate = new Date();

    const fileObjs = files.map((file) => ({
      formatted_set_date: formatDate(currentDate),
      download_url: "",
      updated_at: currentDate,
      name: file.name,
      file_type: file.type,
      file_extension_type: extractFileExtension(file.name),
      file_size: file.size,
      classification: "product and service",
      tags: [],
      created_at: currentDate,
      parent_directory: null,
    }));

    try {
      const uploadPromises = fileObjs.map(async (fileObj) => {
        const response = await createFile(fileObj);
        return response.data;
      });

      const receivedData = await Promise.all(uploadPromises);

      console.log({ receivedData });

      if (id === null) {
        setAllDocs([...allDocs, ...receivedData]);
      }
      // store data in case doc is dropped from computer to a folder which then calls api getSingleDrirctory() in folder component to update files length
      setFolderDropData(receivedData);

      handleApiSuccess("Files have been uploaded successfully");
    } catch (err) {
      handleApiError(
        err,
        "Oops! Failed to create a new file. Please refresh and try again."
      );
    }
  }

  ///////////////////// function to update a document ////////////////////
  async function updateDocument(documentId, data) {
    setIsDataLoading(true);

    console.log({ documentId, data });

    try {
      const { data: updatedDoc } = await updateFile(documentId, data);

      const updatedDocs = allDocs.map((doc) =>
        doc.id === documentId ? updatedDoc : doc
      );
      setAllDocs(updatedDocs);

      handleApiSuccess("file has been updated");
    } catch (err) {
      handleApiError(
        err,
        "Oops! Failed to update the file. Please refresh and try again."
      );
    }
  }

  ///////////////////// function to delete document ////////////////////
  async function deleteDocument(documentId) {
    // setIsDataLoading(true);

    try {
      await deleteFile(documentId);

      const updatedDocs = allDocs.filter((doc) => doc.id !== documentId);
      setAllDocs(updatedDocs);
      // setIsDataLoading(false);
    } catch (err) {
      handleApiError(
        err,
        "Oops! Failed to delete the file. Please refresh and try again."
      );
    }
  }

  ///////////////////// function to move document ////////////////////
  async function moveDocument(dropTargetFolderId) {
    try {
      await moveFile(draggingDocId, {
        parent_directory_id: dropTargetFolderId,
      });

      const updatedDocs = allDocs.filter((doc) => doc.id !== draggingDocId);
      setAllDocs(updatedDocs);

      // store data in case doc is dropped from computer to a folder which then calls api getSingleDrirctory() in folder component to update files length
      setFolderDropData(updatedDocs);

      handleApiSuccess("file has been moved");
    } catch (err) {
      handleApiError(
        err,
        "Oops! Failed to move the file. Please refresh and try again."
      );
    }
  }

  // Generic api success handling function
  function handleApiSuccess(message) {
    // setToast({
    //   isOpen: true,
    //   msg: message,
    //   variant: "success",
    // });

    setIsLoading(false);
    setIsDataLoading(false);
  }

  // Generic api error handling function
  function handleApiError(error, errorMessage) {
    // setToast({
    //   isOpen: true,
    //   msg: errorMessage,
    //   variant: "error",
    // });
    console.error(error);
    setIsLoading(false);
    setIsDataLoading(false);
  }

  ///////////////////////////DRAG AND DROP FROM COMPUTER FUNCTIONALITY ////////////////////////////
  const [isDragOverDrive, setIsDragOverDrive] = useState(false);

  ////////////////// function to check validity of file
  function isValidFile(file) {
    const maxFileSize = 50000000; // 50 MB in bytes

    const acceptedFormats = {
      "application/pdf": [".pdf"],
      "application/doc": [".doc", ".docx", ".dot"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/xls": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/pptx": [".pptx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    };

    const allowedExtensions = Object.values(acceptedFormats).flat();

    if (file.size > maxFileSize) {
      handleInvalidFileMsg("File size exceeds the maximum limit.");
      return false;
    }

    const fileExtension = extractFileExtension(file.name);
    const fileType = file.type;

    if (
      !allowedExtensions.includes(fileExtension) ||
      !acceptedFormats[fileType]?.includes(fileExtension)
    ) {
      handleInvalidFileMsg("File format is not allowed.");
      return false;
    }

    return true;
  }

  ////////// function to handle file msg /////////////
  function handleInvalidFileMsg(errorMessage) {
    // setToast({
    //   isOpen: true,
    //   msg: errorMessage,
    //   variant: "error",
    // });
  }

  ///// function to handle files droppped from computer into drive
  function onMainDrop(acceptedFiles) {
    setSelectedFolderHeading("");
    setIsDragOverDrive(false);

    const validFiles = acceptedFiles.filter((file) => isValidFile(file));
    createDocument(validFiles);
  }

  ///// function to handle files droppped from computer into any folder
  function onFolderDrop(acceptedFiles, targetFolderId) {
    setSelectedFolderHeading("");
    setIsDragOverDrive(false);

    const validFiles = acceptedFiles.filter((file) => isValidFile(file));
    createDocument(validFiles, targetFolderId);
  }

  const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } =
    useDropzone({
      onDrop: onMainDrop,
      onDragOver: (e) => {
        e.preventDefault();

        setIsDragOverDrive(true);
      },
      onDragLeave: (e) => {
        const relatedTarget = e.relatedTarget;
        if (
          !relatedTarget ||
          (relatedTarget !== e.currentTarget &&
            !e.currentTarget.contains(relatedTarget))
        ) {
          setIsDragOverDrive(false);
        }
      },
      noClick: true,
    });

  return (
    <main className="flex flex-col " {...getMainRootProps()}>
      <input multiple {...getMainInputProps()} />
      <div className="py-6 pl-4 shadow-sm bg-white flex gap-3">
        <h4 className="font-semibold text-xl">Content Drive</h4>
      </div>

      <div className="relative">
        {/* --------- DOTTED LINE APPERS ON DRAG AND DROP ----------- */}
        <div
          className={`${
            (isDragOverDrive || selectedFolderHeading) &&
            "border-[3px] border-dashed border-[#2A47AB]"
          } absolute w-full h-full pointer-events-none z-50`}
        ></div>

        <div className="relative max-h-[calc(100vh-90px)] overflow-auto">
          {/* ---------------------------------- SECTION SEARCH -------------------------------- */}
          <section className="p-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <img
                  src={searchIcon}
                  alt="search icon"
                  loading="lazy"
                  className="absolute top-2.5 left-1.5 w-5"
                />

                <input
                  className="bg-white focus:outline-none block focus:ring-0 focus:ring-gray-200 text-sm text-gray-500 w-full h-10 py-3 pl-9 pr-3 rounded-md border-[1px]"
                  value={searchValue}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                    setSearchValue(e.target.value);
                  }}
                />
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {drpOptions.map((optItem, index) => (
                  <DriveDropDown
                    key={index}
                    {...optItem}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ----------------------------- RECENT SECTION ------------------------------- */}

          {isDataLoading ? (
            <div className="h-screen bg-white rounded-b-lg w-full flex justify-center items-center flex-col py-7 px-2">
              <img className="mx-auto max-w-full" src={lod} alt="Loading..." />
            </div>
          ) : (
            <>
              {/* <section className="recent-section px-6">
                            <h4 className="font-semibold text-sm mb-8">Recent</h4>

                            {currentDocs.length ? (
                                <div className="cards grid grid-cols-4 2xl:flex 2xl:flex-wrap gap-x-[30px] gap-y-5 mb-14">
                                    {currentDocs
                                        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                                        .slice(0, 4)
                                        .map((doc) => (
                                            <Document
                                                key={doc.id}
                                                docData={doc}
                                                updateDocument={updateDocument}
                                                deleteDocument={deleteDocument}
                                                setDraggingFolderId={setDraggingFolderId}
                                                setDraggingDocId={setDraggingDocId}
                                                isDataLoading={isDataLoading}
                                                availableTags={availableTags}
                                            />
                                        ))}
                                </div>
                            ) : (
                                <div className="border-b border-[#DBE0E5] pb-28 pt-[76px] mb-14">
                                    <h5 className="text-base text-center font-semibold text-[#1D2630]">No Documents</h5>
                                    <p className="text-sm text-[#353535] text-center">
                                        Drop documents into Drive or add documents clicking on the “documents +” button.
                                    </p>
                                </div>
                            )}
                        </section> */}

              {/* ---------------------------- FOLDERS SECTION ------------------------------ */}
              <section className="folders-section px-6 pt-1 mt-5">
                <div className="flex justify-between items-center mb-9">
                  <h4 className="font-semibold text-lg">Folders</h4>
                  <div
                    className="flex items-center gap-2  cursor-pointer "
                    onClick={() => {
                      setIsFolderAddModalOpen(true);
                      setSelectedFolderId("");
                    }}
                  >
                    <span className="text-sm font-semibold">Folder</span>
                    <button onClick={() => setFolderName("")}>
                      <img
                        src={plusSign}
                        alt="icon"
                        loading="lazy"
                        className="cursor-pointer"
                      />
                    </button>
                  </div>
                </div>

                {currentFolders.length ? (
                  <div className="cards grid grid-cols-4 2xl:grid-cols-5 gap-x-[3%] gap-y-8 mb-12">
                    {currentFolders.map((folder) => (
                      <Folder
                        key={folder.id}
                        {...folder}
                        setIsFolderAddModalOpen={setIsFolderAddModalOpen}
                        setSelectedFolderId={setSelectedFolderId}
                        draggingFolderId={draggingFolderId}
                        setDraggingFolderId={setDraggingFolderId}
                        draggingDocId={draggingDocId}
                        setDraggingDocId={setDraggingDocId}
                        moveSelectedDirectory={moveSelectedDirectory}
                        setFolderName={setFolderName}
                        isLoading={isLoading}
                        handleDelete={deleteSelectedDirectory}
                        moveDocument={moveDocument}
                        createDocument={createDocument}
                        setSelectedFolderHeading={setSelectedFolderHeading}
                        setIsDragOverDrive={setIsDragOverDrive}
                        selectedFolderHeading={selectedFolderHeading}
                        onFolderDrop={onFolderDrop}
                        removedFolderId={removedFolderId}
                        folderDropData={folderDropData}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="border-b border-[#DBE0E5] pb-20 pt-4 mb-14">
                    <h5 className="text-base text-center font-semibold text-[#1D2630]">
                      No Folders
                    </h5>
                    <p className="text-sm text-[#353535] text-center">
                      Create a folder by clicking on the “Folder +” button.
                    </p>
                  </div>
                )}

                <CustomModal
                  isOpen={isfolderAddModalOpen}
                  onClose={() => setIsFolderAddModalOpen(false)}
                >
                  <div className="p-5 w-[444px] ">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="font-semibold text-xl">
                        {selectedFolderId ? "Update Folder" : "New Folder"}
                      </h3>
                      <div className="w-[15.56px] h-[15.56px]">
                        <span className="cursor-pointer">
                          <CloseIconBlack
                            onClick={() => {
                              setIsFolderAddModalOpen(false);
                            }}
                          />
                        </span>
                      </div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();

                        selectedFolderId
                          ? updateSelectedDirectory(selectedFolderId)
                          : createNewDirectory();
                      }}
                    >
                      <label className="mb-2 block text-sm text-[#5B6B79]">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md py-2 px-3 h-10 border-[1px] border-[#CFD1D4] focus:ring-blue-500 focus:border-blue-500 outline-none mb-7"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        autoFocus
                        required
                      />

                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          className="border-[1px] border-[#DBE0E5] rounded-lg py-[9px] px-4 text-sm font-medium text-[#1D2630]"
                          onClick={(e) => {
                            setIsFolderAddModalOpen(false);
                            setFolderName("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="border-0 bg-[#2A47AB] rounded-lg py-[9px] px-4 text-sm font-medium text-[#ffffff] flex items-center gap-2"
                        >
                          <img src={addLink} alt="icon" loading="lazy" />
                          {selectedFolderId ? "Update" : "Add"}
                        </button>
                      </div>
                    </form>
                  </div>
                </CustomModal>
              </section>

              {/* -------------------------- SECTION DOCUMENT -------------------------------- */}
              <section className="document-section px-6 relative mb-9">
                <div className="flex items-center justify-between mb-9">
                  <h4 className="font-semibold text-lg">Documents</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Document</span>
                    <span className="relative block">
                      <ClickAwayListener
                        onClickAway={() => setAddDoc(false)}
                        className="rounded-r-lg"
                      >
                        <img
                          onClick={() => setShowUploadModal(true)}
                          src={plusSign}
                          alt="icon"
                          className="cursor-pointer"
                        />

                        {/* {addDoc && (
                                                <div className="absolute right-0 top-[100%] px-2 z-[2] min-w-max rounded-md bg-white shadow-md py-1 mt-1">
                                                    <button
                                                        onClick={() => setShowUploadModal(true)}
                                                        className="flex items-center gap-2 text-sm font-normal hover:bg-[#EFEFEF] w-full px-3 py-1"
                                                    >
                                                        <img
                                                            src={uploadIcon}
                                                            alt="icon"
                                                            loading="lazy"
                                                            className="w-3"
                                                        />
                                                        Upload Document
                                                    </button>

                                                    <Link to="/dashboard/create-document">
                                                        <button className="flex items-center gap-2 text-sm font-normal hover:bg-[#EFEFEF] w-full px-3 py-1">
                                                            <img
                                                                src={plusCircle}
                                                                alt="icon"
                                                                loading="lazy"
                                                                className="w-3"
                                                            />
                                                            Create Document
                                                        </button>
                                                    </Link>
                                                </div>
                                            )} */}
                      </ClickAwayListener>
                    </span>
                  </div>
                </div>

                {currentDocs.length ? (
                  <div className="cards grid grid-cols-4 2xl:flex 2xl:flex-wrap gap-x-[30px] gap-y-5">
                    {currentDocs.map((doc) => (
                      <Document
                        key={doc.id}
                        docData={doc}
                        updateDocument={updateDocument}
                        deleteDocument={deleteDocument}
                        setDraggingFolderId={setDraggingFolderId}
                        setDraggingDocId={setDraggingDocId}
                        isLoading={isLoading}
                        availableTags={availableTags}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mb-5">
                    <UploadDriveDocModal
                      isDrive={!currentDocs.length}
                      createDocument={createDocument}
                    />
                  </div>
                )}

                {/* ------------ UPLOAD files MODAL --------------- */}
                <UploadDriveDocModal
                  showUploadModal={showUploadModal}
                  setShowUploadModal={setShowUploadModal}
                  createDocument={createDocument}
                />
              </section>
            </>
          )}
        </div>
      </div>

      {/* ------------- Drag and Drop Toast -------------------- */}
      {(isDragOverDrive || selectedFolderHeading) && (
        <div className="absolute inset-0 min-h-screen pointer-events-none z-50">
          <div className="absolute bottom-3 left-[45%] bg-[#2A47AB] py-3.5 px-16 rounded-full text-center">
            <span className="text-lg opacity-90 text-[#ffffff] block mb-1.5">
              Drop files to upload them to
            </span>

            {selectedFolderHeading && (
              <span className="text-lg font-semibold text-[#ffffff] flex justify-center items-center gap-2">
                <img
                  src={folderOpenSm}
                  alt="icon"
                  loading="lazy"
                  className="w-[18px] h-[18px] bg-[#fffffff]"
                />{" "}
                {selectedFolderHeading}
              </span>
            )}

            {isDragOverDrive && (
              <span className="text-lg font-semibold text-[#ffffff] flex justify-center items-center gap-2">
                <img
                  src={driveWhite}
                  alt="icon"
                  loading="lazy"
                  className="w-[18px] h-[18px] bg-[#fffffff]"
                />{" "}
                Drive
              </span>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default DrivePage;
