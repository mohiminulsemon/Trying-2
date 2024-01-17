import React from 'react';
import { useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux';
import { canvasElementType } from '../../utils/constants';
import { setDraggingElement } from '../../features/canvasSlice';
import { addImage, deleteImage } from '../../features/imageSlice'

function CanvasMediaModal() {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const isViewDropzone = useRef(true);
  const dispatch = useDispatch();
  const mouse = useSelector((state) => state.persist.appReducer.mouse);
  const images = useSelector((state) => state.persist.imageReducer.images);


  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (event) => reject(event);
      img.src = src;
    });
  }

  const onDrop = useCallback((acceptedFiles) => {
    if(isViewDropzone.current){
      console.log('acceptedFiles :>> ', acceptedFiles);
      acceptedFiles.map((file) => {
        //convertBase64(file).then(data => {
          //console.log('data :>> ', data);
          loadImage(URL.createObjectURL(file)).then(img => {
            const newImage = {
              width: img.naturalWidth,
              height: img.naturalHeight,
              src: img.src
            };
            console.log('newImage :>> ', newImage);
            dispatch(addImage(newImage))
          }).catch(event => {
            console.log('onload error', event);
          })
        //})
      });
  }else{
    isViewDropzone.current = true
  }
  }, []);

  const onDragLeave = () => {
    isViewDropzone.current = false
  }


  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({onDrop, onDragLeave, noClick: true,  accept: {"image/*":[]}});

  const handleImageClick = (id) => {
    dispatch(deleteImage(id))
    console.log('images :>> ', images);
  };

  const handleCreateElement = (event, image) => {
    //event.preventDefault();
    // console.log('mouse :>> ', mouse);
    console.log("img drag")
    console.log(event.target.src)
    //console.log('imgurl: image.src :>> ', image.src);
    const element = {
      type: canvasElementType.image,
      src: image.src,
      width: image.width,
      height: image.height,
      top: mouse.y,
      left: mouse.x,
      selected: true
    }
    dispatch(setDraggingElement(element));
  };

  return (
    <div className="p-2 h-screen">
      <button className="text-sm p-1 w-full rounded bg-violet-700 hover:bg-violet-500 text-white" onClick={open}>画像をアップロード</button>
      {/* {
        base64Img && (
          <img src={base64Img} alt="" loading='lazy' />
        )
      } */}
      <div {...getRootProps() } className="h-[calc(100vh-50px)] w-full relative">  
        <input {...getInputProps()}/>

      {
         isDragActive && isViewDropzone.current ?
        (
              /* Drop */
              <div className="h-full w-full absolute text-sm rounded border-dashed border-2 text-center mt-2 bg-gray-200 border-gray-300 text-gray-400 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-400">
                <p>画像ファイルをドロップ</p>
              </div>
        ):
        (
          (
            !images.length ?
            (
                /* Drag */
                <div className="h-full w-full absolute text-sm rounded border-dashed border-2 text-center mt-2 bg-gray-300 border-gray-400 text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                  <p>ここに画像ファイルをドラッグしてアップロードしてください</p>
                </div>
            ):(
              
                // vh : viewport height
                /* Thumbnail */
                <div className="h-auto max-h-full w-full mt-2 absolute overflow-y-scroll grid grid-cols-2 gap-2 ">
                {
                  images &&
                  images.map((image, i) => (
                    <div key={i} className="group relative">
                      <button onClick={() => handleImageClick(image.id)} className="absolute invisible right-1 top-1 bg-red-500 text-white rounded px-2 group-hover:visible hover:bg-red-600 hover:text-gray-100">×</button>
                      <img src={image.src} loading='lazy' onDragStart={(event) => handleCreateElement(event, image)}/>
                    </div>
                  ))
                }
                </div>
            )
          )
        )
      }
        
      </div>
    </div>
  );
}
export default CanvasMediaModal;
