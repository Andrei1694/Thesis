export default function Container({ children }) {
    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {children}
        </div>
    );
}