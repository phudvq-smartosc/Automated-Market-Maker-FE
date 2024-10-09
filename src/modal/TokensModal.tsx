import { CloseIcon } from "../components/icon/CloseIcon";
import Token from "../components/specific/Token";
import { Modal } from "../types/modal";
import { TokenInterface } from "../types/token";
import COINS from "../utils/coins";
import * as chains from '../utils/chains';
import { useQuery } from "@apollo/client";
import { TOKENS_QUERY } from "../utils/queries";
import { useEffect, useState } from "react";
import client from "../components/ApolloClient";

interface TokenModalProps extends Modal {
  index: number;
}

export default function TokensModal({ index, open, onClose }: TokenModalProps) {
  const tokensDefault: TokenInterface[] =  COINS.get(chains.ChainId.LOCAL_ANVIL);

  const [tokens, setTokens] = useState<TokenInterface[]>(tokensDefault)
  const { loading, error, data: queryData } = useQuery(TOKENS_QUERY,
    {
      fetchPolicy: 'no-cache'
    }
  );
  useEffect(() => {
    if (queryData) {
      setTokens(queryData.tokens);      
    }
  }, [queryData]);
 
  useEffect(() => {
    const intervalId = setInterval( async () => {
      if (!loading && queryData) {
        await client.refetchQueries({
          include: [TOKENS_QUERY],
        });
        
        setTokens(queryData.tokens); 
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [loading, queryData]);


  if (loading) return <p></p>;
  if (error) return <p>Error: {error.message}</p>;



  return (
    <div className={`fixed z-50 mx-auto h-full w-full ${open ? "block opacity-100" : "hidden opacity-0"} flex items-center justify-center pt-10 transition duration-500 ease-in`}
    >
      <div className={`modal-box h-4/5 max-h-200 max-w-120 ${open ? "block opacity-100" : "hidden opacity-0"} no-scrollbar overflow-y-auto p-0 transition duration-200 ease-in`}
      >
        <div id="modal-header"className="sticky top-0 z-50 flex items-center justify-between w-full pl-4 pr-2 h-14">
          <h6 className="text-2xl font-bold">Select Token</h6>
          <CloseIcon className="w-6 h-6" onClose={onClose} />
          </div>

        <div id="token-list" className="px-4 py-4">
          {tokens.map((token, indexToken) => (
            <div key={indexToken}>
              <Token
                index={index}
                img={token.img ?token.img : ""}
                name={token.name}
                symbol={token.symbol}
                address={token.id} 
                balance={token.balance ?token.balance : "0"}       
                onClose={onClose} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
