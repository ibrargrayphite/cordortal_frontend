"use client";

import { Editor } from '@tinymce/tinymce-react';
import { getCookie } from '../../utils/cookiesHanlder';

// TinyMCE so the global var exists
import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model'
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin';

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/help/js/i18n/keynav/en';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// Content styles, including inline UI like fake cursors
import 'tinymce/skins/content/default/content';
import 'tinymce/skins/ui/oxide/content';

export default function BundledEditor(props) {
  const defaultConfig = {
    branding: false,
    promotion: false,
    menubar: false,
    statusbar: false,
    resize: true,
    plugins: ["lists", "autolink", "link", "pagebreak", "image",],
    toolbar: "styles | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
    spellchecker_rpc_url: "localhost/ephox-spelling",
    contextmenu: false,
    // Image upload handler for client-side only
    images_upload_handler: async (blobInfo, progress) => {
      try {
        // create a FormData object
        const csrftoken = getCookie("csrftoken");
        const sessionId = getCookie("sessionid");

        let formData = new FormData();
        formData.append(
          "upload",
          blobInfo.blob(),
          blobInfo.filename()
        );

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/leads/image/upload/`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
            headers: {
              Cookie: `csrftoken=${csrftoken}; sessionid=${sessionId}`,
              "X-CSRFToken": csrftoken || "",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Upload failed: " + res.statusText);
        }

        const json = await res.json();
        return json.url;
      } catch (error) {
        console.error("Image upload error:", error);
        // Return a placeholder image or throw error
        throw new Error("Image upload failed. Please try again.");
      }
    },
    ...props.init
  };

  return (
    <Editor
      {...props}
      init={defaultConfig}
    />
  );
}