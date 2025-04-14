import "./a.less"
export interface ArticleItem {
    id: string
    title: string
    icon?: string
    content: string
    pubTime?: string
    from?: string
    type?: string
}

type Option = {
    list: ArticleItem[]
    replaceKey?: Partial<Record<keyof ArticleItem, string | Record<string, string>>>,
    click: (id: string) => void
}



export function ArticleList(opt: Option) {
    return <div className="artclelist">
        {opt.list.map(articleItem => {
            return <div className="article-box" onClick={() => opt.click(articleItem.id)} key={articleItem.id}>
                <div className="article-image" style={{ 'backgroundImage': `url(${articleItem.icon})` }}></div>
                <div className="article-content">
                    <div className="article-title">{opt?.replaceKey.title ? opt?.replaceKey.title as string : articleItem.title}</div>
                    <div className="article-summary">
                        {articleItem.content}
                    </div>
                    <div className="article-info">发布时间：{articleItem.pubTime ?? '---'}  |  类型: {opt?.replaceKey?.type ? typeof opt?.replaceKey?.type === 'string' ? opt?.replaceKey?.type : opt?.replaceKey?.type[articleItem.type] : articleItem.type}</div>
                </div>
            </div>
        })}
    </div>
}