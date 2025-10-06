
interface LoadingProps {
    isLoading: boolean;
    messages?: string[];
    overlay?: boolean;
}

function Loading({isLoading, messages, overlay}: LoadingProps) {
    const classes = overlay ? "fixed inset-0 z-50 flex items-center justify-center bg-black/70" : ""
    return (
        <div>
            {isLoading && (
                <div className={classes}>
                    <div className="flex flex-col gap-7 justify-center items-center h-64">
                        {messages && (
                            <h1 className="font-bold text-2xl">{messages[0]}</h1>
                        )}
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Loading;