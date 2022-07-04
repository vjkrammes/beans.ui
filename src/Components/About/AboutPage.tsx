import { BsDiagram3Fill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../Widgets/Page/PageHeader';
import './AboutPage.css';

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <PageHeader
        heading="About"
        showHomeButton={true}
        secondButton={
          <button
            className="secondarybutton headerbutton-right"
            onClick={() => navigate('/Architecture')}
          >
            <span>
              <BsDiagram3Fill /> Architecture
            </span>
          </button>
        }
      />
      <div className="content">
        <div className="ap__disclaimer">
          <span className="ap__d__firstword">DISCLAIMER</span>: the 'currency'
          used in this application is a fictional currency called BeanBux,
          indicated by the symbol <span className="ap__currency">Ƀ</span>. It
          has no value whatsoever, and is not to be mistaken as representing any
          other currency, real or imaginary. It is worth precisely nothing.
        </div>
        <div className="ap__item">
          This web site is written using{' '}
          <a
            href="https://www.typescriptlang.org/"
            target="_blank"
            rel="noreferrer"
          >
            TypeScript
          </a>
          ,{' '}
          <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
            React
          </a>{' '}
          version 18, and hand crafted{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS"
            target="_blank"
            rel="noreferrer"
          >
            CSS
          </a>{' '}
          for styling.
        </div>
        <div className="ap__item">
          The code repository can be found on GitHub{' '}
          <a
            href="https://github.com/vjkrammes/beans.ui"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </div>
        <div className="ap__item">
          The site is hosted on a{' '}
          <a
            href="https://azure.microsoft.com/en-us/"
            target="_blank"
            rel="noreferrer"
          >
            Microsoft Azure
          </a>{' '}
          web application.
        </div>
        <div className="ap__item">
          The site uses a back-end API to handle the management of data for the
          site. That API is written in{' '}
          <a
            href="https://docs.microsoft.com/en-us/dotnet/csharp/"
            target="_blank"
            rel="noreferrer"
          >
            C#
          </a>{' '}
          version 10 and{' '}
          <a
            href="https://dotnet.microsoft.com/en-us/"
            target="_blank"
            rel="noreferrer"
          >
            .Net Core
          </a>{' '}
          version 6. The back-end API is also hosted on a Microsoft Azure web
          application.
        </div>
        <div className="ap__item">
          The code repository for the API can be found on GitHub{' '}
          <a
            href="https://github.com/vjkrammes/beans "
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </div>
        <div className="ap__item">
          The API uses a multi-layered architecture which can be found in the
          diagram found <a href="/Architecture">here</a>
        </div>
        <div className="ap__item">
          An{' '}
          <a
            href="https://azure.microsoft.com/en-us/services/functions/"
            target="_blank"
            rel="noreferrer"
          >
            Azure Function
          </a>{' '}
          called Beans.Background is used to perform nightly movements of bean
          prices. It is written in C# version 10 using .Net 6. The repository
          for the background function can be found on GitHub{' '}
          <a
            href="https://github.com/vjkrammes/Beans.Background"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </div>
        <div className="ap__item">
          The following external libraries are used in the API:
          <ul>
            <li>
              <a
                href="https://github.com/stefanprodan/AspNetCoreRateLimit"
                target="_blank"
                rel="noreferrer"
              >
                AspNetCoreRateLimit
              </a>{' '}
              used to manage inbound request rates to mitigate{' '}
              <a
                href="https://en.wikipedia.org/wiki/Denial-of-service_attack"
                target="_blank"
                rel="noreferrer"
              >
                denial-of-service
              </a>{' '}
              attacks
            </li>
            <li>
              <a
                href="https://hashids.org/net/"
                target="_blank"
                rel="noreferrer"
              >
                Hashids.Net
              </a>{' '}
              used to encode / obfuscate numerical database IDs
            </li>
            <li>
              <a
                href="https://github.com/DapperLib/Dapper"
                target="_blank"
                rel="noreferrer"
              >
                Dapper
              </a>{' '}
              a minimal{' '}
              <a
                href="https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping"
                target="_blank"
                rel="noreferrer"
              >
                object relational mapper
              </a>{' '}
              (ORM) used to access the SQL database
            </li>
            <li>
              <a
                href="https://github.com/DapperLib/Dapper.Contrib"
                target="_blank"
                rel="noreferrer"
              >
                Dapper.contrib
              </a>{' '}
              an extension library for Dapper
            </li>
            <li>
              <a
                href="https://www.newtonsoft.com/json"
                target="_blank"
                rel="noreferrer"
              >
                Json.NET
              </a>{' '}
              a{' '}
              <a
                href="https://en.wikipedia.org/wiki/JSON"
                target="_blank"
                rel="noreferrer"
              >
                JavaScript Object Notation
              </a>{' '}
              (JSON) library
            </li>
          </ul>
        </div>
        <div className="ap__item">
          The following external libraries are used in the React front end:
          <ul>
            <li>
              <a
                href="https://auth0.com/docs/libraries/auth0-react"
                target="_blank"
                rel="noreferrer"
              >
                @auth0/react
              </a>{' '}
              a library for using{' '}
              <a href="https://auth0.com/" target="_blank" rel="noreferrer">
                Auth0
              </a>{' '}
              for autentication
            </li>
            <li>
              <a href="https://mui.com/" target="_blank" rel="noreferrer">
                @mui.material
              </a>{' '}
              used for pop-up alert styling
            </li>
            <li>
              <a
                href="https://www.syncfusion.com/"
                target="_blank"
                rel="noreferrer"
              >
                @syncfusion
              </a>{' '}
              used for charts and grids
            </li>
            <li>
              <a
                href="https://react-icons.github.io/react-icons/"
                target="_blank"
                rel="noreferrer"
              >
                react-icons
              </a>{' '}
              used for button icons
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/uuid"
                target="_blank"
                rel="noreferrer"
              >
                uuid
              </a>{' '}
              a library for generating{' '}
              <a
                href="https://en.wikipedia.org/wiki/Universally_unique_identifier"
                target="_blank"
                rel="noreferrer"
              >
                Universally Unique Identifiers
              </a>{' '}
              (UUIDs)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
