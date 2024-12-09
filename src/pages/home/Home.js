import UploadFile from "../../components/UploadFile";
import "./Home.css";
import Header from "../Header";

function Home() {
  return (
    <div className="relative h-screen bg-gray-100 text-black font-parkinsans">
      {/* Background Image with Blue Tint */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            'url("https://static.vecteezy.com/system/resources/thumbnails/007/439/278/small/cyberpunk-sci-fi-product-podium-showcase-in-empty-room-with-blue-and-pink-background-technology-and-entertainment-object-concept-3d-illustration-rendering-photo.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-blue-600 opacity-50 z-0"></div>
      </div>

      {/* Issue with scroll bars is because of absolute */}
      <div className="absolute inset-0 z-10 bg-gray-50 min-h-screen flex items-center justify-center px-16">
        <div className="relative w-full max-w-lg">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div><Header/></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-40">
        <h2 className="text-6xl font-semibold text-purple-800 mb-5 text-center">
          Time To Splice Your Tunes
        </h2>
        <h3 className="text-black text-2xl font-normal mb-10 text-center">
          Edit Music Easily
        </h3>

        {/* UploadFile as a large button */}
        <div className="text-white cursor-pointer hover:bg-blue-700 transition-all">
          <UploadFile />
        </div>

        {/* Feature Boxes */}
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {/* Fast MP3 Cutter */}
          <div className=" transform  hover:bg-indigo-300 transition duration-500 hover:scale-105 items-center bg-white shadow-md p-6 rounded-lg text-center">
            <div className="text-purple-500 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-black mb-3">
              Truly Fast MP3 Ringtone Cutter
            </h4>
            <p>
              The tool offers you two ways of trimming MP3 files: you can select
              the length by moving two markers or by inserting the needed time
              in seconds.
            </p>
          </div>

          {/* User-friendly Tool */}
          <div className="transform  hover:bg-indigo-300 transition duration-500 hover:scale-105 items-center bg-white shadow-md p-6 rounded-lg text-center">
            <div className="text-purple-500 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-black mb-3">
              User-friendly Tool
            </h4>
            <p>
              The interface of the audio trimmer is completely intuitive, so you
              won't encounter any problems while editing your music.
            </p>
          </div>

          {/* Completely Online */}
          <div className="transform  hover:bg-indigo-300 transition duration-500 hover:scale-105 items-center bg-white shadow-md p-6 rounded-lg text-center">
            <div className="text-purple-500 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-black mb-3">
              Completely Online
            </h4>
            <p>
              There is no need to download and install the MP3 song cutter to
              your Mac or Windows computer, which makes the whole process go
              much faster.
            </p>
          </div>

          {/* More Settings */}
          <div className="transform  hover:bg-indigo-300 transition duration-500 hover:scale-105 items-center bg-white shadow-md p-6 rounded-lg text-center">
            <div className="text-purple-500 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-black mb-3">
              More Settings
            </h4>
            <p>
              Enjoy extra settings to enhance your music editing experience,
              giving you more flexibility and control.
            </p>
          </div>

          {/* all formats*/}
          <div className="transform  hover:bg-indigo-300 transition duration-500 hover:scale-105 items-center bg-white shadow-md p-6 rounded-lg text-center">
            <div className="text-purple-500 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-black mb-3">
              All Formats
            </h4>
            <p>
              Splicer gives you a possibility to work with not only MP3, but
              also with OGG, WMA, WAV and other popular formats.
            </p>
          </div>

          {/* secure */}
          <div className="transform  hover:bg-indigo-300 transition duration-500 hover:scale-105 items-center bg-white shadow-md p-6 rounded-lg text-center">
            <div className="text-purple-500 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-black mb-3">Secure</h4>
            <p>
              You can not worry about someone listening to your audio, because
              no one has access to your uploaded files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;