import { useState, useEffect } from "react";
import CustomModal from "../CustomModal";
import cross from "@assets/crosss.svg";
import upload from "@assets/upload-folder 1.svg";
import pdf from "@assets/pdf.svg";
import xls from "@assets/xls.svg";
import ppt from "@assets/ppt.svg";
import union from "@assets/addlink.svg";
import trash from "@assets/trash.svg";
import { useToastContext } from "@context/toastContext";
import { Spinner } from "@utils/icons";
import docs from "@assets/doc.svg";
import { useDropzone } from "react-dropzone";
import { formatBytes } from "@utils/helpers";

// Max size 50 MB
const maxSize = 50000000;

// ------------------- Upload new Doc modal handler --------------------------------
const UploadDriveDocModal = ({
  showUploadModal,
  setShowUploadModal,
  createDocument,
  isDrive,
}) => {
  const [uploading, setUploadingLoading] = useState(false);
  const { setToast } = useToastContext();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (isDrive) {
      onSaveBtn();
    }
  }, [files]);

  // close modal
  const closeModal = () => {
    if (uploading) return;
    setShowUploadModal(false);
    setFiles([]);
  };

  // on file drop/select
  const onDrop = async (acceptedFiles) => {
    if (uploading) return;
    if (acceptedFiles && acceptedFiles?.length > 0) {
      let newFiles = [];
      acceptedFiles.forEach((file) => {
        if (files.find((b) => b.name === file.name)) {
          return;
        }
        newFiles.push(file);
      });
      let prevFiles = [...newFiles, ...files];
      setFiles(prevFiles);
    }
  };

  // validation
  const dropValidator = (file) => {
    if (file?.size > maxSize) {
      setToast({
        isOpen: true,
        msg:
          file?.name +
          " size is too large. Please try again with a different file or contact support@vultron.ai",
        variant: "error",
      });
      return {
        code: "file-too-large",
        message: `File is larger than ${formatBytes(maxSize)}`,
      };
    }

    return null;
  };

  // drop files hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxSize,
    validator: dropValidator,
    accept: {
      "text/pdf": [".pdf", ".doc", ".docx"],
      "text/doc": [".doc", ".docx"],
      "text/excel": [".xlsx"],
      "text/powerpoint": [".pptx"],
    },
    noClick: false,
    maxFiles: 30,
    multiple: true,
  });

  // remove file
  const removeFile = (file) => {
    let prevFiles = [...files];
    prevFiles = prevFiles.filter((f) => f !== file);
    setFiles(prevFiles);
  };

  const imgIcon = (type) => {
    let img = pdf;
    switch (type) {
      case "application/pdf":
        img = pdf;
        break;
      case "application/doc":
      case "application/docx":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        img = docs;
        break;
      case "application/xls":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        img = xls;
        break;
      case "application/pptx":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        img = ppt;
        break;
      default:
        img = docs;
    }
    return img;
  };

  // On save
  const onSaveBtn = async () => {
    setUploadingLoading(true);

    await createDocument(files);

    setUploadingLoading(false);
  };

  return (
    <>
      {isDrive ? (
        <div
          {...getRootProps()}
          className="p-3 w-full mx-auto cursor-pointer relative border-gray-300 border-dashed border-2 m-3 justify-center flex flex-col items-center rounded-lg bg-[#fafafa] min-h-[220px]"
        >
          <input multiple {...getInputProps()} />
          {isDragActive ? (
            <div className="absolute bg-gray-300 flex justify-center items-center text-gray-700 top-0 left-0 h-full w-full z-[2] bg-dark1 bg-opacity-75">
              {" "}
              Drop your file here...
            </div>
          ) : null}

          <span className="font-semibold">Drop or Select File</span>
          <span className="text-gray-text">
            Drop files here or browse through your machine
          </span>
        </div>
      ) : (
        <CustomModal
          isOpen={showUploadModal}
          onClose={closeModal}
          className="w-full max-w-[596px]"
        >
          <div>
            <div className="px-6 pt-4 flex justify-between">
              <h3 className="font-semibold text-lg">Upload Files</h3>
              <img
                src={cross}
                alt=""
                className="cursor-pointer"
                onClick={closeModal}
              />
            </div>
            <div className="py-1 px-6">
              <div
                {...getRootProps()}
                className="p-3 w-full mx-auto cursor-pointer relative border-gray-300 border-dashed border-2 m-3 justify-center flex flex-col items-center rounded-lg bg-[#fafafa] min-h-[220px]"
              >
                <input multiple {...getInputProps()} />
                {isDragActive ? (
                  <div className="absolute bg-gray-300 flex justify-center items-center text-gray-700 top-0 left-0 h-full w-full z-[2] bg-dark1 bg-opacity-75">
                    {" "}
                    Drop your file here...
                  </div>
                ) : null}
                <img src={upload} alt="" />
                <span className="font-semibold">Drop or Select File</span>
                <span className="text-gray-text">
                  Drop files here or browse through your machine
                </span>
              </div>
              {/* ---------------------------------- */}
              {files?.map((fileItem, i) => (
                <div
                  key={i}
                  className="p-3 flex justify-between items-center w-full"
                >
                  <div className="flex gap-3 px-3 flex-grow max-w-[95%]">
                    <img src={imgIcon(fileItem?.type)} alt="" />
                    <div className="flex flex-col max-w-[93%]">
                      <span
                        style={{
                          wordWrap: "break-word",
                          textOverflow: "clip",
                        }}
                        className="block text-sm font-medium break-words overflow-hidden max-w-full"
                      >
                        {fileItem?.name}
                      </span>
                      <span className="text-xs">
                        {formatBytes(fileItem?.size)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="px-2 min-w-[33px] w-[33px] border-0 b-white"
                    onClick={() => removeFile(fileItem)}
                  >
                    <img src={trash} alt="" />
                  </button>
                </div>
              ))}
              <div className="flex mt-4 justify-end items-center gap-4 my-2">
                <button
                  className="border-gray-300 border px-4 py-2 rounded-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  className="bg-main-blue disabled:opacity-50 py-2 px-4 flex gap-1 items-center text-white rounded-lg min-w-[117px] bg-blue-600"
                  disabled={files?.length > 0 ? false : true}
                  onClick={onSaveBtn}
                >
                  {uploading ? (
                    <>
                      <Spinner width={17} height={17} /> Importing files
                    </>
                  ) : (
                    <>
                      <img className="mr-1" src={union} alt="" /> Add Files
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default UploadDriveDocModal;
