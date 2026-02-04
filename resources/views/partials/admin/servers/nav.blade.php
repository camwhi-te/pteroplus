@section('servers::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="nav-tabs-custom nav-tabs-floating">
                <ul class="nav nav-tabs">
                    <li @if($activeTab === 'servers')class="active"@endif><a href="{{ route('admin.servers') }}">Server List</a></li>
                    <li @if($activeTab === 'mounts')class="active"@endif><a href="{{ route('admin.servers.mounts') }}">Mounts</a></li>
                </ul>
            </div>
        </div>
    </div>
@endsection
