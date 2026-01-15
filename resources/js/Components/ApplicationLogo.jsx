import { Building2 } from 'lucide-react';

export default function ApplicationLogo(props) {
    return (
        <div {...props} className={`flex items-center justify-center text-blue-600 ${props.className}`}>
            <Building2 className="w-full h-full" />
        </div>
    );
}
