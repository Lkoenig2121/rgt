import ReactPDF, { PDFDownloadLink as PDFDL } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

type Props = {
  document: React.ReactElement<ReactPDF.DocumentProps>;
  fileName?: string;
  label?: string;
  className?: string;
};

export const PDFDownloadLink = ({
  document,
  className,
  fileName = `test`,
  label = `Download PDF`,
}: Props) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient && (
        <PDFDL
          document={document}
          fileName={`${fileName}.pdf`}
          className={className}
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : label
          }
        </PDFDL>
      )}
    </>
  );
};
