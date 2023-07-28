import { useState } from 'react'
import { toast } from 'react-toastify'
import { reloadCurrentPage } from '../functions'
import { client } from '../functions/api/client'

type Props = {
  rubyMethod: {
    id: number
    official_url: string
  }
  userRubyMethod: {
    id: number
  }
  memo: string
  setMemo: React.Dispatch<React.SetStateAction<string>>
}

export const LearningPhase = ({
  rubyMethod,
  userRubyMethod,
  memo,
  setMemo,
}: Props) => {
  const [previousMemo, setPreviousMemo] = useState('')
  const [showEditor, setShowEditor] = useState(false);
  const [code, setCode] = useState('');
  const [resCode, setResCode] = useState([]);
  const isInvalidMemo = () => {
    if (memo === previousMemo) return true
  }

  const changeMemo = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMemo(event.target.value)
  }

  const changeText = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCode(event.target.value)
  }

  const updateMemo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    client
      .patch(`user_ruby_methods/${userRubyMethod.id}.json`, {
        user_ruby_method: { ruby_method_id: rubyMethod.id, memo },
      })
      .then(() => {
        toast('メモを保存しました😊')
        setPreviousMemo(memo)
        setTimeout(() => {
          reloadCurrentPage()
        }, 2000)
      })
      .catch(function (error) {
        console.log(error.response)
      })
  }

  const execCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(code)
    client
      .post(`/exec_code.json`, {
        code: code,
        // change_text: changeText,
      })
      .then((res) => {
        console.log(res.data.resultCode)
        setResCode(res.data.resultCode)
        console.log('成功')
      })
      .catch(function (error) {
        console.log(error.response)
      })
  }


  return (
    <div>
      <div className="flex mb-6">
        <iframe
          className={`w-full h-96`}
          src={rubyMethod.official_url}
        ></iframe>
      </div>
      <div>
        <button
          className="btn btn-sm mb-5 btn-neutral"
          onClick={() => setShowEditor(!showEditor)}
        >
          コードを試してみる
        </button>
      </div>
      {showEditor && (
        <div className="flex mb-6">
          <form onSubmit={execCode}>
            <label>
              <span className="font-bold">試したいコードを貼ってください</span>
              <textarea
                value={code ?? ''}
                onChange={changeText}
                rows={5}
                className="block shadow rounded-md border border-black  outline-none px-3 py-2 w-full"
              ></textarea>
            </label>
            <div className="mb-5">
              <button className="btn btn-outline mt-2">
                実行する
              </button>
            </div>
            {resCode.map((code) => {
              return <p key={code}>{code}</p>
            })}
          </form>
        </div>
      )}
      <form onSubmit={updateMemo}>
        <label>
          <span className="font-bold">覚えやすいようにメモを取ろう</span>
          <textarea
            value={memo ?? ''}
            onChange={changeMemo}
            rows={5}
            className="block shadow rounded-md border border-black  outline-none px-3 py-2 w-full"
          ></textarea>
        </label>
        <div className="mb-5">
          <button className="btn btn-outline mt-2" disabled={isInvalidMemo()}>
            保存する
          </button>
        </div>
      </form>
      <div className="mb-5">
        <div>
          <button
            className="btn mt-2 btn-info"
            onClick={() => reloadCurrentPage()}
          >
            次の問題へ
          </button>
        </div>
        <p className="text-blue-700	text-bold text-xl mt-20 mb-10 underline mt-4">
          <a href={rubyMethod.official_url} target="_blank">
            公式サイトへアクセスして確認する
          </a>
        </p>
        <div className="mt-10">
          <a href="new" className="me-8 underline">
            クイズの条件を変える
          </a>
          <a href="/user_ruby_methods" className="underline">
            メソッド一覧へ
          </a>
        </div>
      </div>
    </div>
  )
}
