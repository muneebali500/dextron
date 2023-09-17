import { useState, useEffect } from "react";

///////////////// IMPORTING IMAGES AND ICONS //////////////////////
import dots from "@assets/3dots.svg";
import download from "@assets/downloadlrg.svg";
import trash from "@assets/trashlrg.svg";
import properties from "@assets/properties-icon.svg";
import dropdownIcon from "@assets/icon-wrapper.svg";
import addLink from "@assets/addlink.svg";
import doc from "@assets/generic-doc.png";
import info from "@assets/info.svg";
import { CalenderIcon, CloseIconBlack } from "@utils/icons";

/////////////// IMPORTING THIRD PARTY LIBRAIES AND COMPONENTS ////////////
import DatePicker from "react-multi-date-picker";

/////////////////// IMPORTING CUSTOM COMPONENTS AND FUNCTIONS //////////////
import ClickAwayListener from "@helpers/ClickAwayListener";
import CustomModal from "../CustomModal";
import TagComponent from "./TagComponent";
import TagWithColor from "./TagWithColor";
import { formatDate } from "@utils/helpers";

//////////////////////// START OF MAIN FUNCTION //////////////////////////
//////////////////////////////////////////////////////////////////////////
export default function Document({
  updateDocument,
  deleteDocument,
  setDraggingFolderId,
  setDraggingDocId,
  docData,
  availableTags,
}) {
  const {
    id,
    name,
    formatted_set_date,
    tags,
    file_extension_type,
    download_url,
    classification,
    updated_at,
    file_type,
  } = docData;

  const [docMenu, setDocMenu] = useState(false);
  const [isDocEditModalOpen, setIsDocEditModalOpen] = useState(false);
  const [isDocPreview, setIsDocPreview] = useState(false);
  const [docName, setDocName] = useState(name);
  const [isClassficationDropdown, setIsClassficationDropdown] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState("");
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(tags);
  const [tagInput, setTagInput] = useState("");
  const [updateDate, setUpdateDate] = useState(updated_at);
  const [isInfoIconHoevr, setIsInfoIconHover] = useState(false);

  const classifications = [
    "Product and service",
    "Reference",
    "Certification",
    "Proposal",
  ];

  useEffect(() => {
    setSelectedTags(tags);
    setSelectedClassification(
      classification[0].toUpperCase() +
        classification.slice(1).split("_").join(" ")
    );

    const updateD = new Date(formatted_set_date).toDateString();
    console.log({ updateD });
    setUpdateDate(updateD);
    setDocName(name.replace(/\.[^/.]+$/, ""));
  }, [tags, classification, updated_at, name]);

  const handleClassificationSelect = (classification) => {
    setSelectedClassification(classification);
    setIsClassficationDropdown(false);
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      // If tag already selected, remove it from the list
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      // If tag not selected, add it to the list
      setSelectedTags([...selectedTags, tag]);
    }
  };

  /////////////// functions updates document data ////////////
  function handleUpdate() {
    const updatedData = {};

    if (docName.trim() !== "") {
      updatedData.name = docName.trim() + file_extension_type;
    }

    updatedData.classification = selectedClassification
      .toLowerCase()
      .split(" ")
      .join("_");
    updatedData.tags = selectedTags;
    updatedData.formatted_set_date = formatDate(updateDate);

    setIsDocEditModalOpen(false);
    setDocName("");
    updateDocument(id, updatedData);
  }

  ///////////////////// drag and drop function ////////////////

  const handleDrag = (e) => {
    e.preventDefault();

    setDraggingDocId(id);
    setDraggingFolderId("");
  };

  const handleDownload = () => {
    // Create a Blob from the base64 data
    const blob = new Blob([docData], { type: file_type });

    // Create a download URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element for downloading
    const a = document.createElement("a");
    a.href = url;
    a.download = name;

    // Trigger a click event on the anchor element
    a.click();

    // Clean up the URL object to free up resources
    window.URL.revokeObjectURL(url);
  };

  //////////////////////// START OF JSX /////////////////////
  return (
    <div
      className="card flex flex-col 2xl:w-[258px]"
      onDrag={handleDrag}
      draggable={!isDocEditModalOpen}
    >
      <figure
        className="relative overflow-hidden w-full h-48 rounded-md bg-[#DEE1E3] p-5 flex justify-center items-center cursor-pointer"
        onClick={() => setIsDocPreview(true)}
      >
        <img
          src={doc}
          alt="Doc Preview"
          loading="lazy"
          className="w-auto max-w-full"
        />
        <div className="iframe-overlay absolute h-full w-full border-[2px] cursor-pointer bg-[transparent]"></div>
      </figure>

      <div className="border-[1px] flex-1 bg-white -mt-12 p-4 rounded-b-md z-20">
        <div className="flex justify-between gap-2 mb-0.5">
          <p className="font-semibold text-[10px] break-all">{name}</p>
          <ClickAwayListener
            onClickAway={() => setDocMenu(null)}
            className="relative"
          >
            <img
              src={dots}
              alt="Three Dots"
              className="cursor-pointer select-none max-w-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setDocMenu(!docMenu);
              }}
            />
            {docMenu && (
              <div className="absolute right-1 top-[100%] rounded-md z-[2] bg-white shadow-md py-2 w-[128px]">
                {/* <a
                  href={name + file_extension_type}
                  download={name}
                  className="flex gap-2 items-center text-sm font-normal py-1 px-2 hover:bg-[#EFEFEF]"
                >
                  <img src={download} alt="icon" loading="lazy" />
                  Download
                </a> */}

                <button
                  className="flex gap-2 items-center text-sm font-normal py-1 px-2 hover:bg-[#EFEFEF]"
                  onClick={handleDownload}
                >
                  <img src={download} alt="icon" loading="lazy" />
                  Download
                </button>

                <button
                  className="flex gap-2 items-center w-full text-sm font-normal py-1 px-2 hover:bg-[#EFEFEF]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setIsDocEditModalOpen(true);
                  }}
                >
                  <img
                    src={properties}
                    alt="icon"
                    loading="lazy"
                    className="mr-0.5"
                  />
                  Properties
                </button>

                <button
                  onClick={() => deleteDocument(id)}
                  className="flex items-center gap-2 text-red-600 py-1 px-2 text-sm disabled:opacity-60 cursor-pointer select-none w-full hover:bg-[#EFEFEF]"
                >
                  <img src={trash} alt="icon" loading="lazy" />
                  Delete
                </button>
              </div>
            )}
          </ClickAwayListener>
        </div>
        <p className="text-[10px] text-[#5B6B79] mb-2">
          Opened {formatted_set_date}
        </p>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <>
              <TagWithColor key={index} tag={tag} />
            </>
          ))}
        </div>
      </div>

      {/*------------------- MODAL OPENS WHEN CLICK ON PROPERTIES DOC MENU ------------------------*/}
      <CustomModal
        isOpen={isDocEditModalOpen}
        onClose={() => setIsDocEditModalOpen(false)}
      >
        <div className="p-6 w-[663px] ">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-semibold text-sm">Edit Properties</h3>
            <div className="w-[15.56px] h-[15.56px]">
              <span className="cursor-pointer">
                <CloseIconBlack
                  onClick={() => {
                    setIsDocEditModalOpen(false);
                  }}
                  className="h-3 w-3"
                />
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-2 block text-sm text-[#5B6B79]">
              Document Name
            </label>
            <input
              type="text"
              className="w-full rounded-md py-2 px-4 h-10 border-[1px] outline-none focus:ring-blue-500 focus:border-blue-500 text-sm select-text text-[#1E1E1E]"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>

          <div className="relative mb-3">
            <label className="mb-2 block text-sm text-[#5B6B79]">
              Document Classification
            </label>
            <ClickAwayListener
              onClickAway={() => setIsClassficationDropdown(false)}
            >
              <button
                onClick={() =>
                  setIsClassficationDropdown(!isClassficationDropdown)
                }
                className="relative py-2 w-full px-4 h-10 text-left text-[#5B6B79] bg-white border rounded-md text-sm outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {selectedClassification || "Select classification"}

                <img
                  src={dropdownIcon}
                  alt="Icon"
                  loading="lazy"
                  className="absolute h-3 w-3 top-3.5 right-3.5"
                />
              </button>

              {isClassficationDropdown && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-[0_9px_28px_#00000014] py-1 z-10">
                  {classifications.map((classification) => (
                    <button
                      key={classification}
                      onClick={() => handleClassificationSelect(classification)}
                      className="block w-full px-3 py-2 text-left text-sm text-[#1E1E1E] hover:bg-gray-200 focus:outline-none"
                    >
                      {classification}
                    </button>
                  ))}
                </div>
              )}
            </ClickAwayListener>
          </div>

          <div className="mb-3 relative">
            <div className="flex items-center gap-1">
              <label className="mb-2 block text-sm text-[#5B6B79]">Tags</label>
              <div className="relative group -mt-1.5">
                <img
                  src={info}
                  alt="Info Icon"
                  loading="lazy"
                  className="w-2.5"
                  onMouseOver={() => setIsInfoIconHover(true)}
                  onMouseLeave={() => setIsInfoIconHover(false)}
                />

                {isInfoIconHoevr && (
                  <div className="absolute font-inter font-medium w-max max-w-[360px] top-[180%] left-[-54px] cursor-pointer rounded border-[2px] border-[#dbe0e5] bg-white shadow-xl z-30">
                    <div className="menu-arrow !bg-[#dbe0e5] !left-[58px]"></div>
                    <div className="bg-white p-2">
                      <p className="text-xs text-gray-primary font-normal pr-1">
                        Tags assist the AI in finding relevant content when
                        drafting responses.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <ClickAwayListener onClickAway={() => setIsTagsDropdownOpen(false)}>
              <div
                className="relative flex flex-wrap items-center py-2 gap-2 w-full pl-4 pr-8 min-h-[40px] text-left  bg-white border rounded-md text-sm outline-none focus:ring-blue-500 focus:border-blue-500"
                onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
              >
                {selectedTags.length > 0 &&
                  selectedTags.map((tag) => (
                    <TagComponent
                      key={tag}
                      tag={tag}
                      handleTagSelect={handleTagSelect}
                      removeTag={true}
                    />
                  ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    setSelectedTags([...selectedTags, tagInput]);
                    setTagInput("");
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add Tags"
                    className={`outline-none text-sm text-[#5b6b79] ${
                      !selectedTags.length && "w-full"
                    } `}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    autoFocus={selectedTags.length}
                  />
                </form>

                <img
                  src={dropdownIcon}
                  alt="Icon"
                  loading="lazy"
                  className="absolute h-3 w-3 top-3.5 right-3.5 cursor-pointer"
                />
              </div>
              {isTagsDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-[0_9px_28px_#00000014] p-3">
                  <h5 className="text-[10px] text-[#5B6B79] mb-2.5">
                    Recommended
                  </h5>
                  <ul className="flex flex-wrap gap-2 max-h-[60px] overflow-y-auto">
                    {availableTags.length
                      ? availableTags
                          .filter((tag) =>
                            tag.toLowerCase().includes(tagInput.toLowerCase())
                          )
                          ?.map((tag) => (
                            <TagComponent
                              key={tag}
                              handleTagSelect={handleTagSelect}
                              tag={tag}
                              addTag={true}
                            />
                          ))
                      : ["Proposal", "Resource", "RFPs", "Certifications"]
                          .filter((tag) =>
                            tag.toLowerCase().includes(tagInput.toLowerCase())
                          )
                          ?.map((tag) => (
                            <TagComponent
                              key={tag}
                              handleTagSelect={handleTagSelect}
                              tag={tag}
                              addTag={true}
                            />
                          ))}
                  </ul>
                </div>
              )}
            </ClickAwayListener>
          </div>

          <div className="mb-3">
            <label className="mb-2 block text-sm text-[#5B6B79]">Date</label>
            <DatePicker
              format="MM/DD/YYYY"
              value={updateDate}
              onChange={(e, t) => {
                setUpdateDate(new Date(t?.validatedValue[0]).toDateString());
              }}
              containerClassName="!w-full !max-w-full"
              render={(value, openCalendar) => {
                return (
                  <div
                    onClick={openCalendar}
                    tabIndex="0"
                    className="relative text-[#5b6b79] py-2 cursor-pointer select-none w-full px-4 overflow-hidden border text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block"
                  >
                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer select-none">
                      <CalenderIcon className="w-3" />
                    </div>
                    <p>{updateDate || "Update Date"}</p>
                  </div>
                );
              }}
            />
          </div>

          <div className="flex justify-end gap-4 mt-14">
            <button
              type="button"
              className="border-[1px] border-[#DBE0E5] rounded-lg py-[9px] px-4 text-sm font-medium text-[#1D2630]"
              onClick={() => setIsDocEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border-0 bg-[#2A47AB] rounded-lg py-[9px] px-4 text-sm font-medium text-[#ffffff] flex items-center gap-2"
              onClick={handleUpdate}
            >
              Save
            </button>
          </div>
        </div>
      </CustomModal>

      {/*----------------------- PEVIEW DOCUMENT MODAL ----------------------*/}
      {/* <CustomModal isOpen={isDocPreview} onClose={() => setIsDocPreview(false)}>
        <div className="w-[1020px] h-[1150px] pb-4">
          <div className="py-4 px-6 flex justify-between items-center border-b">
            <h3 className="font-medium text-base">{name}</h3>
            <div className="w-[15.56px] h-[15.56px]">
              <span className="cursor-pointer">
                <CloseIconBlack
                  onClick={(e) => {
                    setIsDocPreview(false);
                  }}
                />
              </span>
            </div>
          </div>

          <div className="p-5 h-full">
            <iframe
              src={
                "https://docs.google.com/gview?url=" +
                encodeURIComponent(download_url) +
                "&embedded=true"
              }
              className="w-full h-full"
              title="vut doc"
            ></iframe>
          </div>
        </div>
      </CustomModal> */}
    </div>
  );
}
