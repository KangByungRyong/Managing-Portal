
  # 포털 화면 구성

  This is a code bundle for 포털 화면 구성. The original project is available at https://www.figma.com/design/g7x6XTYB4KGbRuqcB2b5DV/%ED%8F%AC%ED%84%B8-%ED%99%94%EB%A9%B4-%EA%B5%AC%EC%84%B1.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Kakao Map Dev Setup

  1. Create `.env.local` in the project root.
  2. Add `VITE_KAKAO_MAP_APP_KEY=<your_kakao_javascript_key>`.
  3. In Kakao Developers, register the web platform domain as `http://localhost:5173`.
  4. Restart the dev server after changing the env file.

  The current implementation only loads the Kakao Maps SDK for development verification. The visible map card remains a static preview until the actual map rendering step is added.
  